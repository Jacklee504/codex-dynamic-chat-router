# Routing levels and reasoning effort

`low`, `medium`, and `high` are routing-level adjustments, not provider
reasoning settings. Medium preserves the role/risk baseline. Low may choose a
cheaper eligible tier; high may choose a stronger eligible tier for ambiguity,
dependency analysis, or review depth.

The router then selects internal effort separately from complexity and risk,
and reports any requested-to-effective mapping. A low routing-level bounded
implementation can correctly use Luna with high effort; a high routing level
does not automatically mean a provider's maximum reasoning setting. Hard risk
and privacy rules take precedence over both.
