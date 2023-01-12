FUSE_VERSION := 6.6.2
KATEX_VERSION := 0.16.4
P5_VERSION := 1.4.2

AUTHOR_NAME := $(shell sed -n 's/name = "\(.*\)"/\1/p' config.toml | head -n1)
AUTHOR_HANDLE := $(shell sed -n 's/github = "\(.*\)"/\1/p' config.toml | head -n1)

CONTENT_DIR := content
PUBLIC_DIR := public
CACHE_DIR := resources/_gen
STATIC_JS_DIR := static/js

CONVERTIBLE_EXTENSIONS := png
CONVERTIBLE_INCLUDE_DIR := $(PUBLIC_DIR)
CONVERTIBLE_EXCLUDE_DIRS := $(PUBLIC_DIR)/images
CONVERTIBLE_CACHE_DIR := $(CACHE_DIR)/images
FUSE_DIR := $(STATIC_JS_DIR)/fuse-v$(FUSE_VERSION)
KATEX_DIR := $(STATIC_JS_DIR)/katex-v$(KATEX_VERSION)
P5_DIR := $(STATIC_JS_DIR)/p5-v$(P5_VERSION)

CONVERTIBLE_FIND_INCLUDE := $(subst =, ,$(subst $(eval) , -o ,$(patsubst %,-iname='*.%',$(CONVERTIBLE_EXTENSIONS))))
CONVERTIBLE_FIND_EXCLUDE := $(subst =, ,$(subst $(eval) , -o ,$(patsubst %,-path='%',$(CONVERTIBLE_EXCLUDE_DIRS))))
CONVERTIBLE_FILES := $(shell find $(CONVERTIBLE_INCLUDE_DIR) \( $(CONVERTIBLE_FIND_EXCLUDE) \) -prune -false -o -type f \( $(CONVERTIBLE_FIND_INCLUDE) \) 2> /dev/null)
CONVERTIBLE_FILES_AVIF := $(addsuffix .avif, $(CONVERTIBLE_FILES))
CONVERTIBLE_FILES_WEBP := $(addsuffix .webp, $(CONVERTIBLE_FILES))

COMPRESSABLE_EXTENSIONS := css html js json mjs svg webmanifest xml
COMPRESSABLE_INCLUDE_DIR := $(PUBLIC_DIR)

COMPRESSABLE_FIND_INCLUDE := $(subst =, ,$(subst $(eval) , -o ,$(patsubst %,-iname='*.%',$(COMPRESSABLE_EXTENSIONS))))
COMPRESSABLE_FILES := $(shell find $(COMPRESSABLE_INCLUDE_DIR) -type f \( $(COMPRESSABLE_FIND_INCLUDE) \) 2> /dev/null)
COMPRESSABLE_FILES_BROTLI := $(addsuffix .br, $(COMPRESSABLE_FILES))
COMPRESSABLE_FILES_GZIP := $(addsuffix .gz, $(COMPRESSABLE_FILES))

CONTENT_COVER_TEMPLATE := static/images/cover-template.png

CONTENT_INDEXES := $(shell find $(CONTENT_DIR) -type f -name _index.md 2> /dev/null)
CONTENT_INDEXES_COVERS := $(addsuffix __cover@2x.png, $(dir $(CONTENT_INDEXES)))
CONTENT_ARTICLES := $(shell find $(CONTENT_DIR) -type f -name index.md 2> /dev/null)
CONTENT_ARTICLES_COVERS := $(addsuffix _cover@2x.png, $(dir $(CONTENT_ARTICLES)))

.PHONY: all
all: build

.PHONY: clean
clean:
	@rm -rf $(PUBLIC_DIR)/*
	@rm -rf $(CACHE_DIR)/*

.PHONY: test
test:
	@npm run lint
	@npm run test

.PHONY: server
server:
	@hugo server --buildDrafts --buildFuture --buildExpired

.PHONY: build
build: covers
	@hugo --cleanDestinationDir --minify
# Restart make to force reevaluation of find commands at the top.
	@$(MAKE) --no-print-directory optimize

.PHONY: build-dev
build-dev: export HUGO_BASEURL = https://dev.unindented.org
build-dev: build

.PHONY: build-prod
build-prod: export HUGO_BASEURL = https://www.unindented.org
build-prod: build

.PHONY: deploy
deploy:
	@rsync --archive --delete --exclude-from .rsyncignore public/ unindented:/home/unindented/$(RSYNC_PATH)/
	@echo
	@echo "Finished deploying!"

.PHONY: deploy-dev
deploy-dev: export RSYNC_PATH = dev.unindented.org
deploy-dev: build-dev deploy

.PHONY: deploy-prod
deploy-prod: export RSYNC_PATH = unindented.org
deploy-prod: build-prod deploy

.PHONY: pre-optimize
pre-optimize:
	@echo
	@echo "Optimizing files..."
# Touch all files in the cache so that they're not rebuilt.
	@find $(CACHE_DIR) -type f -exec touch {} + 2> /dev/null

optimize: pre-optimize convert-avif convert-webp compress-brotli compress-gzip
	@echo
	@echo "Finished optimizing!"

convert-avif: $(CONVERTIBLE_FILES_AVIF)
	@echo
	@echo "Finished converting files to AVIF!"

convert-webp: $(CONVERTIBLE_FILES_WEBP)
	@echo
	@echo "Finished converting files to WEBP!"

compress-brotli: $(COMPRESSABLE_FILES_BROTLI)
	@echo
	@echo "Finished compressing files with Brotli!"

compress-gzip: $(COMPRESSABLE_FILES_GZIP)
	@echo
	@echo "Finished compressing files with Gzip!"

covers: $(CONTENT_INDEXES_COVERS) $(CONTENT_ARTICLES_COVERS)
	@echo
	@echo "Finished generating cover files!"

$(CONVERTIBLE_INCLUDE_DIR)/%.avif: $(CONVERTIBLE_CACHE_DIR)/%.avif
	@cp $< $@

$(CONVERTIBLE_INCLUDE_DIR)/%.webp: $(CONVERTIBLE_CACHE_DIR)/%.webp
	@cp $< $@

.PRECIOUS: $(CONVERTIBLE_CACHE_DIR)/%.avif
$(CONVERTIBLE_CACHE_DIR)/%.avif: $(CONVERTIBLE_CACHE_DIR)/%
	@cavif --quiet --quality 80 --overwrite -o $@ $<
	@printf "."

.PRECIOUS: $(CONVERTIBLE_CACHE_DIR)/%.webp
$(CONVERTIBLE_CACHE_DIR)/%.webp: $(CONVERTIBLE_CACHE_DIR)/%
	@cwebp -quiet -q 95 -o $@ $<
	@printf "."

.PRECIOUS: $(CONVERTIBLE_CACHE_DIR)/%.png
$(CONVERTIBLE_CACHE_DIR)/%.png: $(CONVERTIBLE_INCLUDE_DIR)/%.png
	@mkdir -p $(dir $@)
	@cp -p $< $@

$(COMPRESSABLE_INCLUDE_DIR)/%.br: $(COMPRESSABLE_INCLUDE_DIR)/%
	@brotli -f -o $@ $<
	@touch $@
	@printf "."

$(COMPRESSABLE_INCLUDE_DIR)/%.gz: $(COMPRESSABLE_INCLUDE_DIR)/%
	@gzip -f -k $<
	@touch $@
	@printf "."

%/__cover@2x.png: %/_index.md $(CONTENT_COVER_TEMPLATE)
	$(eval $@_TITLE := $(shell sed -n 's/title = "\(.*\)"/\1/p' $<))
	@convert $(CONTENT_COVER_TEMPLATE) \
	  \( -size 625x275 \
	     -background none \
	     -fill white \
	     -font "Roboto" \
	     -gravity northwest \
	     caption:"$($@_TITLE)" \) \
	  -gravity northwest \
	  -geometry +75+110 \
	  -composite \
	  \( -size 450x50 \
	     -background none \
	     -fill "#a1a1aa" \
	     -font "Roboto" \
	     -gravity northwest \
	     label:"$(AUTHOR_NAME)" \) \
	  -gravity northwest \
	  -geometry +250+465 \
	  -composite \
	  \( -size 450x40 \
	     -background none \
	     -fill "#a1a1aa" \
	     -font "Roboto" \
	     -gravity northwest \
	     label:"@$(AUTHOR_HANDLE)" \) \
	  -gravity northwest \
	  -geometry +250+525 \
	  -composite \
	  $@
	@printf "."

%/_cover@2x.png: %/index.md $(CONTENT_COVER_TEMPLATE)
	$(eval $@_TITLE := $(shell sed -n 's/title = "\(.*\)"/\1/p' $<))
	@convert $(CONTENT_COVER_TEMPLATE) \
	  \( -size 625x35 \
	     -background none \
	     -fill "#a1a1aa" \
	     -font "Roboto" \
	     -gravity northwest \
	     label:"Check out this article" \) \
	  -gravity northwest \
	  -geometry +75+50 \
	  -composite \
	  \( -size 625x275 \
	     -background none \
	     -fill white \
	     -font "Roboto" \
	     -gravity northwest \
	     caption:"$($@_TITLE)" \) \
	  -gravity northwest \
	  -geometry +75+110 \
	  -composite \
	  \( -size 450x50 \
	     -background none \
	     -fill "#a1a1aa" \
	     -font "Roboto" \
	     -gravity northwest \
	     label:"$(AUTHOR_NAME)" \) \
	  -gravity northwest \
	  -geometry +250+465 \
	  -composite \
	  \( -size 450x40 \
	     -background none \
	     -fill "#a1a1aa" \
	     -font "Roboto" \
	     -gravity northwest \
	     label:"@$(AUTHOR_HANDLE)" \) \
	  -gravity northwest \
	  -geometry +250+525 \
	  -composite \
	  $@
	@printf "."

.PHONY: fuse
fuse:
	@mkdir -p $(FUSE_DIR)
	@curl -Lo $(FUSE_DIR)/fuse.min.js https://cdn.jsdelivr.net/npm/fuse.js@$(FUSE_VERSION)/dist/fuse.esm.min.js
	@echo
	@echo "Finished downloading Fuse.js!"

.PHONY: katex
katex:
	@curl -Lo $(STATIC_JS_DIR)/katex.zip https://github.com/KaTeX/KaTeX/releases/download/v$(KATEX_VERSION)/katex.zip
	@unzip -d $(STATIC_JS_DIR) $(STATIC_JS_DIR)/katex.zip
	@rm $(STATIC_JS_DIR)/katex.zip
	@mv $(STATIC_JS_DIR)/katex $(KATEX_DIR)
	@cd $(KATEX_DIR) && npx rollup -c ../../../rollup.katex.mjs
	@rm -rf $(KATEX_DIR)/contrib
	@find $(KATEX_DIR) -depth 1 -type f -not \( -name 'katex.min.mjs' -or -name 'katex.min.css' \) -delete
	@echo
	@echo "Finished downloading KaTeX!"

.PHONY: p5
p5:
	@mkdir -p $(P5_DIR)
	@curl -Lo $(P5_DIR)/p5.min.js https://github.com/processing/p5.js/releases/download/v$(P5_VERSION)/p5.min.js
	@echo
	@echo "Finished downloading p5.js!"
