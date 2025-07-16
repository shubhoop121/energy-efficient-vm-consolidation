import random

# --- VM Class ---

class VM:
    """Represents a Virtual Machine with dynamic resource requirements."""
    def __init__(self, vm_id, cpu_req, mem_req):
        self.id = vm_id
        self.cpu_req = cpu_req
        self.mem_req = mem_req
        self.assigned_host = None

    def update_requirements(self, cpu_delta, mem_delta):
        """Update the VM's CPU and memory requirements dynamically."""
        self.cpu_req = max(0, self.cpu_req + cpu_delta)
        self.mem_req = max(0, self.mem_req + mem_delta)

# --- Host Class ---

class Host:
    """Represents a Physical Host with varying resources and power states."""
    def __init__(self, host_id, total_cpu, total_mem):
        self.id = host_id
        self.total_cpu = total_cpu
        self.total_mem = total_mem
        self.available_cpu = total_cpu
        self.available_mem = total_mem
        self.idle_steps = 0
        self.vms = []

    def can_host(self, vm):
        """Check if the host has sufficient resources for a VM."""
        return self.available_cpu >= vm.cpu_req and self.available_mem >= vm.mem_req

    def assign_vm(self, vm):
        """Assign a VM to this host if resources are available."""
        if self.can_host(vm):
            self.available_cpu -= vm.cpu_req
            self.available_mem -= vm.mem_req
            self.vms.append(vm)
            vm.assigned_host = self.id
            return True
        return False

    def remove_vm(self, vm):
        """Remove a VM from this host and free its resources."""
        if vm in self.vms:
            self.available_cpu += vm.cpu_req
            self.available_mem += vm.mem_req
            self.vms.remove(vm)
            vm.assigned_host = None
            return True
        return False

    def get_cpu_utilization(self):
        """Calculate current CPU utilization as a fraction."""
        if self.total_cpu == 0:
            return 0.0
        return (self.total_cpu - self.available_cpu) / self.total_cpu

    def get_mem_utilization(self):
        """Calculate current memory utilization as a fraction."""
        if self.total_mem == 0:
            return 0.0
        return (self.total_mem - self.available_mem) / self.total_mem

    def power_consumption(self):
        """
        Calculate power consumption based on CPU and memory utilization.
        Uses a weighted model: 150W base + utilization-driven increase up to 250W.
        """
        if not self.vms:
            return 0
        base_power = 150
        max_power = 250
        cpu_util = self.get_cpu_utilization()
        mem_util = self.get_mem_utilization()
        util = 0.7 * cpu_util + 0.3 * mem_util
        return base_power + (max_power - base_power) * util

# --- Cloud Environment Class ---

class CloudEnvironment:
    """Manages a realistic cloud simulation with hosts and VMs."""
    def __init__(self, num_hosts=12, num_vms=18):
        # Heterogeneous hosts with varying CPU (80-120) and memory (160-240)
        self.hosts = [Host(i, random.randint(80, 120), random.randint(160, 240)) for i in range(num_hosts)]
        self.vms = [VM(i, random.randint(10, 30), random.randint(20, 50)) for i in range(num_vms)]
        self._history = []  # For simulate/rollback
        self.overload_threshold = 0.8
        self.underload_threshold = 0.2
        self._initial_allocation()

    def tick_idle_counters(self):
        """Increment idle steps for hosts without VMs."""
        for host in self.hosts:
            if not host.vms:
                host.idle_steps += 1
            else:
                host.idle_steps = 0

    def _initial_allocation(self):
        """Place VMs on hosts using a first-fit strategy."""
        for vm in self.vms:
            placed = False
            for host in self.hosts:
                if host.assign_vm(vm):
                    placed = True
                    break
            # SLA violation if not placed

    def update_vm_workloads(self):
        """Simulate dynamic changes in VM resource demands."""
        for vm in self.vms:
            cpu_delta = random.randint(-5, 5)
            mem_delta = random.randint(-10, 10)
            vm.update_requirements(cpu_delta, mem_delta)

    def get_state(self):
        """Return a simplified state representation for decision-making."""
        state = []
        for host in self.hosts:
            if not host.vms:
                state.append('off')
                continue
            util = host.get_cpu_utilization()
            if util > self.overload_threshold:
                state.append('over')
            elif util < self.underload_threshold:
                state.append('under')
            else:
                state.append('normal')
        return tuple(state)

    def get_host_status(self):
        """Categorize hosts based on utilization levels."""
        overloaded, underloaded, normal = [], [], []
        for host in self.hosts:
            if not host.vms:
                continue
            util = host.get_cpu_utilization()
            if util > self.overload_threshold:
                overloaded.append(host)
            elif util < self.underload_threshold:
                underloaded.append(host)
            else:
                normal.append(host)
        return overloaded, underloaded, normal

    def simulate_migration(self, src_id, dst_id, vm):
        """Simulate a VM migration and return success status."""
        src = self.hosts[src_id]
        dst = self.hosts[dst_id]
        if vm not in src.vms or not dst.can_host(vm):
            return False
        self._history.append((src, dst, vm))
        src.remove_vm(vm)
        dst.assign_vm(vm)
        return True

    def rollback(self):
        """Revert the last simulated migration."""
        if not self._history:
            return
        src, dst, vm = self._history.pop()
        dst.remove_vm(vm)
        src.assign_vm(vm)

    def migrate_vm(self, vm, target_host):
        """Migrate a VM to a target host if possible."""
        if vm.assigned_host is None:
            return False
        current = self.hosts[vm.assigned_host]
        if target_host.can_host(vm):
            current.remove_vm(vm)
            target_host.assign_vm(vm)
            return True
        return False

    def terminate_vm(self, vm_id):
        """Terminate a VM and remove it from the environment."""
        vm = next((v for v in self.vms if v.id == vm_id), None)
        if vm and vm.assigned_host is not None:
            host = self.hosts[vm.assigned_host]
            host.remove_vm(vm)
            self.vms.remove(vm)

    def get_total_power(self):
        """Calculate total power consumption across all hosts."""
        return sum(host.power_consumption() for host in self.hosts)

    def reset(self):
        """Reset the environment for a new simulation episode."""
        for host in self.hosts:
            host.vms.clear()
            host.available_cpu = host.total_cpu
            host.available_mem = host.total_mem
            host.idle_steps = 0
        for vm in self.vms:
            vm.assigned_host = None
        self._history.clear()
        self._initial_allocation()

    def get_metrics(self):
        """Return detailed metrics about the cloud environment."""
        active = [h for h in self.hosts if h.vms]
        cpu_utils = [h.get_cpu_utilization() for h in active]
        mem_utils = [h.get_mem_utilization() for h in active]
        idle_steps = [h.idle_steps for h in self.hosts]
        return {
            'total_power_consumption': self.get_total_power(),
            'active_hosts': len(active),
            'avg_cpu_utilization': sum(cpu_utils) / len(cpu_utils) if cpu_utils else 0,
            'avg_mem_utilization': sum(mem_utils) / len(mem_utils) if mem_utils else 0,
            'total_idle_steps': sum(idle_steps),
            'sla_violations': sum(1 for vm in self.vms if vm.assigned_host is None)
        }