build:
	jupyter nbconvert --to slides notebooks/index.ipynb --reveal-prefix=reveal.js --SlidesExporter.reveal_theme=white --SlidesExporter.reveal_scroll=True --SlidesExporter.reveal_transition=none

docs/%.html: notebooks/%.html
	@[ -d docs ] || mkdir docs
	cp $< $@
	mv $@ docs/index.html
	git add docs/index.html
	git commit -m 'Make: updated slides'
	git push origin master
