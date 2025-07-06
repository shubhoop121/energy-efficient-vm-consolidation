# backend/src/env/cloud_env.py

import random

class VM:
    def __init__(self, vm_id, cpu, memory, start_time=0, end_time=100):
        self.vm_id = vm_id
        self.cpu = cpu
        self.memory = memory
        self.start_time = start_time
        self.end_time = end_time
        self.host_id = None  # assigned host

class Host:
    def __init__(self, host_id, total_cpu, total_memory):
        self.host_id = host_id
        self.total_cpu = total_cpu
        self.total_memory = total_memory
        self.vms = []

    def available_cpu(self):
        return self.total_cpu - sum(vm.cpu for vm in self.vms)

    def available_memory(self):
        return self.total_memory - sum(vm.memory for vm in self.vms)

    def assign_vm(self, vm):
        if vm.cpu <= self.available_cpu() and vm.memory <= self.available_memory():
            self.vms.append(vm)
            vm.host_id = self.host_id
            return True
        return False

    def remove_vm(self, vm):
        if vm in self.vms:
            self.vms.remove(vm)

class CloudEnvironment:
    def __init__(self, num_hosts=5, num_vms=10):
        self.hosts = [Host(i, total_cpu=100, total_memory=200) for i in range(num_hosts)]
        self.vms = [VM(i, cpu=random.randint(10, 30), memory=random.randint(20, 50)) for i in range(num_vms)]

    def reset(self):
        for host in self.hosts:
            host.vms.clear()
        for vm in self.vms:
            vm.host_id = None

    def allocate_initial(self):
        for vm in self.vms:
            for host in self.hosts:
                if host.assign_vm(vm):
                    break

    def get_state(self):
        # Could be a list of utilization per host
        return [(h.available_cpu(), h.available_memory()) for h in self.hosts]
