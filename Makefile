slides:
	# Converts index notebook to slides at notebooks/index.slides.html
	jupyter nbconvert --to slides notebooks/female-rep.ipynb --reveal-prefix=https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.6.0 --SlidesExporter.reveal_theme=white --SlidesExporter.reveal_scroll=True --SlidesExporter.reveal_transition=none

	# Moves new slides to index
	mv notebooks/female-rep.slides.html notebooks/female-rep.html

# TODO: aws sync
