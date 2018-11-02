# Converts index notebook to slides at notebooks/index.slides.html
build_slides:
	jupyter nbconvert --to slides notebooks/index.ipynb --reveal-prefix=reveal.js --SlidesExporter.reveal_theme=white --SlidesExporter.reveal_scroll=True --SlidesExporter.reveal_transition=none

# Moves new slides to index
%.html: notebooks/%.html
	@[ -d docs ] || mkdir docs
	cp $< $@
	rm $@
	mv $@ index.html

# Pushes new slides
push:
	git add index.html
	git commit -m 'Make: updated slides'
	git push origin master

build:
	build_slides index.slides.html push