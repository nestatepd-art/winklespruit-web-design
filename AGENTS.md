
- Theme lives in CSS variables in src/index.css; dark sections use the `.theme-ink` class to override them locally — never hardcode colours per section.
- Homepage sections live in src/components/home/; scroll reveal uses `.reveal` + useRevealAll in Index — keeps motion in one place and respects reduced motion.
