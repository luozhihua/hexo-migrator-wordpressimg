# WordPress migrator

Migrate your blog from WordPress to [Hexo], moved images wich posts has used, and will generated a json map using for send 301 redirect from wordpress posts to hexo posts.

## Install

``` bash
$ npm install hexo-migrator-wordpressimg --save
```

## Usage

Export your WordPress in "Tools" → "Export" → "WordPress" in your dashboard.

Execute the following command after installed. `source` is the file path or URL of WordPress export file.

``` bash
$ hexo migrate wordpressimg <source>
```

## Images

If your posts in wordpress included some images, It will download those images to `${hexo_site}/source/imgs/`, and update images url in the new posts.

## 301 Maps

After 'hexo migrate wordpressimg <source>' completed, A new file '301.json' will created in the root of your hexo blog: `${hexo_site}/301.json`, this file saved wordpres's post id, title, date..., can used for 301 redirect, if you dont know how to use this file, there is a demo: (hexo-wordpress-redirect)[https://github.com/luozhihua/hexo-wordpress-redirecter].