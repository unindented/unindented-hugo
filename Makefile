FUSE_VERSION := 6.6.2
KATEX_VERSION := 0.16.7
P5_VERSION := 1.4.2

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
build:
	@hugo --cleanDestinationDir --minify

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
