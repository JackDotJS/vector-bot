<!--OB {
  "opts": {
    "color": "default",
    "footer": {
      "mode": "TABLE",
      "fields": false,
      "image": "https://raw.githubusercontent.com/JackDotJS/vector-bot/wiki-assets/info_pages_example/banners/table.png"
    }
  }
} -->

<div align="center">
  <img alt="Section 1" src="https://raw.githubusercontent.com/JackDotJS/vector-bot/wiki-assets/info_pages_example/banners/section1.png" width="512px">
</div>

### Embed Title
Embed Description

#### Field 1 Name
Field 1 Contents

#### Field 2 Name
Field 2 Contents

<div align="center">
  <img alt="Section 2" src="https://raw.githubusercontent.com/JackDotJS/vector-bot/wiki-assets/info_pages_example/banners/section2.png" width="512px">
</div>

### Embed Title
This embed includes inline fields.

#### Field 1
<!--OB { "inline": true } -->
This field will be on the left side.

#### Field 2
<!--OB { "inline": true } -->
This field will be on the right side.

### Replacing Text
Text can be replaced when being translated to embed form. For example:

<!--OB "select" -->
This text only appears on GitHub.
<!--OB { "replace": "This text only appears in Discord." } -->

### LinkFrom Jump Example
<!--OB { 
  "linkfrom": "jump",
  "tags": [
    "example", "example 2", "example 3"
  ] 
} -->

You can jump directly to this embed from a few links on this page.

### Embed Colors Example 1
<!--OB {
  "color": "error"
} -->

This embed, when viewed in Discord, uses the color specified by `config.colors.error`.

### Embed Colors Example 2
<!--OB {
  "color": "okay"
} -->

This embed, when viewed in Discord, uses the color specified by `config.colors.okay`.

### LinkTo Jump Example 2

<!--OB "select" -->
[This link (again) leads to another section in this page.](#jump-target) <!--OB { "linkto": "jump" } -->