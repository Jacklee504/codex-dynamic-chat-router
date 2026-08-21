# Safety policy

All Phase 2 executions remain read-only. Selection and fan-out must fail
closed instead of silently relaxing local-only, privacy, tool, risk-effort, or
model-family constraints.

Provider unavailability may select the next eligible candidate only if every
hard constraint remains true. The decision record retains the rejection and
selected fallback. Local Ollama is never pulled automatically.

Fan-out sends the identical compact prompt independently to each selected
family. It does not include sibling responses in any request, and it returns
raw bounded results to the lead for integration. It never performs a model
synthesis step in this phase.
