KATEX_VERSION := 0.15.2
P5_VERSION := 1.4.1

CONTENT_DIR := content
PUBLIC_DIR := public
CACHE_DIR := resources/_gen
STATIC_JS_DIR := themes/custom/static/js

CONVERTIBLE_EXTENSIONS := png
CONVERTIBLE_INCLUDE_DIR := $(PUBLIC_DIR)
CONVERTIBLE_EXCLUDE_DIRS := $(PUBLIC_DIR)/images
CONVERTIBLE_CACHE_DIR := $(CACHE_DIR)/images
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

CONTENT_INDEX_COVER_TEMPLATE := themes/custom/static/images/cover-template.png
CONTENT_INDEX_INCLUDE_DIR := $(CONTENT_DIR)

CONTENT_INDEX_FILES := $(shell find $(CONTENT_INDEX_INCLUDE_DIR) -type f -name index.md 2> /dev/null)
CONTENT_INDEX_FILES_COVER := $(addsuffix _cover@2x.png, $(dir $(CONTENT_INDEX_FILES)))

TWITTER_HANDLE := $(shell sed -n 's/twitter = "\(.*\)"/\1/p' config.toml)

.PHONY: all
all: build

.PHONY: clean
clean:
	@rm -rf $(PUBLIC_DIR)/*
	@rm -rf $(CACHE_DIR)/*

.PHONY: server
server:
	@hugo server

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

covers: $(CONTENT_INDEX_FILES_COVER)
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

$(CONTENT_INDEX_INCLUDE_DIR)/%/_cover@2x.png: $(CONTENT_INDEX_INCLUDE_DIR)/%/index.md $(CONTENT_INDEX_COVER_TEMPLATE)
	$(eval $@_TITLE := $(shell sed -n 's/title = "\(.*\)"/\1/p' $<))
	@convert $(CONTENT_INDEX_COVER_TEMPLATE) \
	  \( -size 280x64 \
	     -background none \
	     -fill white \
	     -font 'xkcdScript' \
	     -gravity center \
	     label:'@$(TWITTER_HANDLE)' \) \
	  -gravity northwest \
	  -geometry +76+432 \
	  -composite \
	  \( -size 696x480 \
	     -background none \
	     -fill white \
	     -font 'xkcdScript' \
	     -gravity center \
	     caption:'$($@_TITLE)' \) \
	  -gravity northwest \
	  -geometry +432+76 \
	  -composite \
	  $@
	@printf "."

.PHONY: katex
katex:
	@curl -Lo $(STATIC_JS_DIR)/katex.zip https://github.com/KaTeX/KaTeX/releases/download/v$(KATEX_VERSION)/katex.zip
	@unzip -d $(STATIC_JS_DIR) $(STATIC_JS_DIR)/katex.zip
	@rm $(STATIC_JS_DIR)/katex.zip
	@mv $(STATIC_JS_DIR)/katex $(KATEX_DIR)
	@cd $(KATEX_DIR) && npx rollup -c ../../../../../rollup.katex.mjs
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