#!/usr/bin/env python3
import sys
import os
import time
import json
import pandas as pd
from tqdm import tqdm
import argparse
from concurrent.futures import ProcessPoolExecutor

# --- Path Setup ---
base_path = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "backend", "src", "agent")
)
sys.path.insert(0, base_path)

try:
    from q_learning import QLearningAgent
except ImportError:
    print("❌ Error: Could not import QLearningAgent from q_learning_agent.py")
    sys.exit(1)

# --- Single Run Function for Parallel Execution ---
def single_run(alpha, gamma, episodes, time_steps):
    """Executes a single independent training run without loading/saving Q-table."""
    agent = QLearningAgent(
        alpha=alpha,
        gamma=gamma,
        episodes=episodes,
        time_steps_per_episode=time_steps
    )
    # Train without loading or saving Q-table
    agent.train()
    env_metrics = agent.env.get_metrics()
    avg_reward = sum(agent.get_learning_curve()) / len(agent.get_learning_curve())
    return {
        "avg_reward": avg_reward,
        **env_metrics
    }

# --- Batch Execution Function ---
def run_batch_simulations(
    num_runs: int,
    episodes: int,
    time_steps: int,
    alpha: float,
    gamma: float,
    independent_runs: bool = False
):
    """
    Runs multiple training sessions, either independently or sequentially.
    Returns a list of dicts: one dict per run containing final env metrics and avg reward.
    """
    all_results = []

    if independent_runs:
        # Parallel execution for independent runs
        with ProcessPoolExecutor() as executor:
            futures = [
                executor.submit(single_run, alpha, gamma, episodes, time_steps)
                for _ in range(num_runs)
            ]
            for i, future in enumerate(tqdm(futures, desc="Batch Simulations", unit="run")):
                result = future.result()
                result["run"] = i + 1
                all_results.append(result)
    else:
        # Sequential execution with Q-table continuity
        for run in tqdm(range(1, num_runs + 1), desc="Batch Simulations", unit="run"):
            agent = QLearningAgent(
                alpha=alpha,
                gamma=gamma,
                episodes=episodes,
                time_steps_per_episode=time_steps
            )
            agent.load_q_table()  # Load previous Q-table if exists
            agent.train()
            agent.save_q_table()  # Save updated Q-table
            env_metrics = agent.env.get_metrics()
            avg_reward = sum(agent.get_learning_curve()) / len(agent.get_learning_curve())
            result = {
                "run": run,
                "avg_reward": avg_reward,
                **env_metrics
            }
            all_results.append(result)

    return all_results

# --- Main Execution Block ---
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Batch test the optimized Q-Learning agent for VM consolidation"
    )
    parser.add_argument("--runs", type=int, default=30, help="Number of runs")
    parser.add_argument("--episodes", type=int, default=1000, help="Episodes per run")
    parser.add_argument(
        "--time_steps", type=int, default=50,
        help="Time steps per episode"
    )
    parser.add_argument("--alpha", type=float, default=0.1, help="Learning rate")
    parser.add_argument("--gamma", type=float, default=0.9, help="Discount factor")
    parser.add_argument(
        "--independent_runs", action="store_true",
        help="Run each simulation independently without loading/saving Q-table"
    )
    parser.add_argument(
        "--export_csv", type=str, default=None,
        help="If provided, writes per-run results to this CSV file"
    )
    args = parser.parse_args()

    mode = "Independent" if args.independent_runs else "Continuous"
    print(f"🔎 Batch test ({mode}): {args.runs} runs, {args.episodes} episodes, "
          f"{args.time_steps} steps/ep | α={args.alpha}, γ={args.gamma}")
    start = time.time()

    results = run_batch_simulations(
        num_runs=args.runs,
        episodes=args.episodes,
        time_steps=args.time_steps,
        alpha=args.alpha,
        gamma=args.gamma,
        independent_runs=args.independent_runs
    )

    duration = time.time() - start
    df = pd.DataFrame(results)

    # Summary statistics
    summary = df.drop(columns=["run"]).agg(["mean", "std"]).T.rename(
        columns={"mean": "Mean", "std": "StdDev"}
    )

    print(f"\n✅ Batch completed in {duration:.2f} seconds")
    print("\n--- Summary Statistics ---")
    print(summary.to_string())

    # Export detailed results if requested
    if args.export_csv:
        df.to_csv(args.export_csv, index=False)
        print(f"\n📁 Detailed per-run results written to {args.export_csv}")