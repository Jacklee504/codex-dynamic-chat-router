# Acceptance scenarios

Use these scenarios to evaluate both adapters.

1. **Single writer**: a task that changes one contract creates one writer, not
   several competing implementers.
2. **Parallel-safe work**: independent implementation and test paths may run in
   parallel with explicit file boundaries.
3. **Status-only**: a status request changes no task state and creates no task target.
4. **Fresh review**: review occurs after integration and the reviewer is
   read-only.
5. **Honest abort**: when native stop is unavailable, the adapter tells the user
   how to stop task targets instead of claiming success.
6. **Restart**: a changed objective creates a fresh run rather than repurposing
   an old task target.
7. **Tier selection**: a read-only inventory uses the fast tier, an isolated
   test or documentation task uses the standard tier, and a shared or ambiguous
   contract uses the deep tier.
8. **Critical path**: auth, secret-bearing, financial, destructive, or
   production work uses the critical tier and receives a fresh critical review.
9. **Unavailable tier**: the adapter reports an unsupported or unavailable
   selection instead of silently running a cheaper model.
10. **Context budget**: a dispatched task receives paths/symbols and only
    essential facts, not a parent or sibling transcript; its normal return is
    structured, four lines or fewer, and contains no raw log dump.
11. **Lead efficiency**: a trivial answer remains in the lead, and a routed
    run stores only the target's compact decision record and returned evidence.
12. **Routing default**: an unspecified routed task records `medium` and
    keeps its class baseline tier.
13. **Routing adjustment**: a low mechanical task selects a cheaper eligible
    tier and a high ambiguous task selects a stronger eligible tier.
14. **Routing safety floor**: a low request cannot reduce critical work below
    the critical tier; the parent records the constraint.
15. **Independent effort**: a low routing-level, bounded implementation may
    select Luna with high effort; the routing level does not mechanically set
    the target model's effort.
16. **Straightforward implementation**: a normal bounded implementation selects
    an eligible implementation prior with medium effort and one family.
17. **Difficult unknown bug**: difficult debugging selects a strong debugger
    prior with high effort; a requested fan-out uses independent families.
18. **High-risk financial review**: the high-risk effort floor applies and an
    independent review is required when high diversity is requested.
19. **Local-only log analysis**: only an installed local Ollama model is
    eligible; there is no remote fallback.
20. **Provider unavailable**: the record names the unavailable candidate and
    chooses an eligible fallback, or reports a clear failure.
