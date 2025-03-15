
<script src="https://unpkg.com/split-type"></script>

const text = new SplitType('#target', { types: 'words, chars' })

// Animate characters into view with a stagger effect
gsap.from(text.chars, {
  opacity: 0,
  y: 20,
  duration: 0.5,
  stagger: { amount: 0.1 },
})