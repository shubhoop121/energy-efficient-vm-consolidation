class BestFitAgent:
    """
    Best-Fit VM placement strategy.
    Chooses the host that leaves the least remaining resources after placing the VM.
    """

    def __init__(self, env):
        """
        Initialize the BestFitAgent with the environment.
        :param env: CloudEnvironment instance.
        """
        self.env = env

    def place_vm(self, vm):
        """
        Places the VM on the host that results in the least amount of remaining resource wastage.
        :param vm: The VM object to be placed.
        :return: Host ID if placed, else None.
        """
        best_host_id = None
        best_fit_score = float("inf")  # Lower is better

        for host_id, host in enumerate(self.env.hosts):
            if host.can_host(vm):
                # Calculate resource wastage (lower is better)
                cpu_gap = host.cpu_remaining() - vm.cpu
                mem_gap = host.mem_remaining() - vm.memory
                fit_score = cpu_gap + mem_gap

                if fit_score < best_fit_score:
                    best_fit_score = fit_score
                    best_host_id = host_id

        if best_host_id is not None:
            self.env.allocate_vm_to_host(vm, best_host_id)

        return best_host_id

    def run(self):
        """
        Run the Best-Fit algorithm across the entire simulation.
        :return: Dictionary of final metrics.
        """
        self.env.reset()

        for t in range(self.env.time_steps):
            vms_to_place = self.env.get_incoming_vms()

            for vm in vms_to_place:
                self.place_vm(vm)

            self.env.step()

        return self.env.get_metrics()
