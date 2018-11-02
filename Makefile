build_slides:
	jupyter nbconvert --to slides notebooks/index.ipynb --reveal-prefix=reveal.js --SlidesExporter.reveal_theme=white --SlidesExporter.reveal_scroll=True --SlidesExporter.reveal_transition=none

%.html: notebooks/%.html
	@[ -d docs ] || mkdir docs
	cp $< $@
	mv $@ index.html

push:
	git add index.html
	git commit -m 'Make: updated slides'
	git push origin master

build:
	build_slides index.slides.html interactive push