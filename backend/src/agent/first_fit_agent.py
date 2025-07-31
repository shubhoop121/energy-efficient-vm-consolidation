class FirstFitAgent:
    """
    A simple First-Fit VM placement strategy.
    Iterates over hosts and places the VM in the first one that has enough resources.
    """

    def __init__(self, env):
        """
        Initialize the FirstFitAgent with the environment.
        :param env: CloudEnvironment object with hosts and VMs.
        """
        self.env = env

    def place_vm(self, vm):
        """
        Attempts to place a VM on the first host that can accommodate it.
        :param vm: VM object to be placed.
        :return: Host ID if placement is successful, else None.
        """
        for host_id, host in enumerate(self.env.hosts):
            if host.can_host(vm):
                self.env.allocate_vm_to_host(vm, host_id)
                return host_id
        return None  # No suitable host found

    def run(self):
        
        self.env.reset()

        for t in range(self.env.time_steps):
            vms_to_place = self.env.get_incoming_vms()

            for vm in vms_to_place:
                self.place_vm(vm)

            self.env.step()

        return self.env.get_metrics()
