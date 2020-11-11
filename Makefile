CONTENT_DIR := content
PUBLIC_DIR := public
CACHE_DIR := resources/_gen

CONVERTIBLE_EXTENSIONS := png
CONVERTIBLE_INCLUDE_DIR := $(PUBLIC_DIR)
CONVERTIBLE_EXCLUDE_DIRS := $(PUBLIC_DIR)/images
CONVERTIBLE_CACHE_DIR := $(CACHE_DIR)/images

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
build:
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
