# Offer BP configuration samples

Place the two customer Offer BP Excel exports here (Pharos-backed dashboard uses parsed output for hypotheses only; charts stay on validated warehouse metrics).

Expected filenames (from the dashboard follow-up plan):

- `offer_default_definition.xlsx`
- `vmware_offer_default_definition.xlsx`

After copying, run:

```bash
python3 scripts/parse_offer_bp_config_xlsx.py research/Offer/bp-config-samples/
```

The parser lists worksheets, steps, and approval patterns for PM-facing hypotheses.
