MARKDOWN := $(wildcard content/*)
HTML := $(MARKDOWN:.md=.html)

all: $(HTML)

%.html: %.md
	sed '/^!.*/d' $< | ./Markdown.pl > $@
