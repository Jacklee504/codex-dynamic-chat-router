# Acceptance scenarios

Use these scenarios to evaluate both adapters.

1. **Single writer**: a task that changes one contract creates one writer, not
   several competing implementers.
2. **Parallel-safe work**: independent implementation and test paths may run in
   parallel with explicit file boundaries.
3. **Status-only**: a status request changes no task state and creates no worker.
4. **Fresh review**: review occurs after integration and the reviewer is
   read-only.
5. **Honest abort**: when native stop is unavailable, the adapter tells the user
   how to stop workers instead of claiming success.
6. **Restart**: a changed objective creates a fresh run rather than repurposing
   an old worker.
