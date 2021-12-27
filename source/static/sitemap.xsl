<?xml version="1.0" encoding="UTF-8"?>
<html xsl:version="1.0"
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      xmlns:x="http://www.sitemaps.org/schemas/sitemap/0.9"
>
    <body style="font-family:Arial;font-size:12pt;background-color:#EEEEEE">
        <h1>Sitemap</h1>
        <div class="container">
            <xsl:for-each select="//x:urlset/x:url">
                <a href="{x:loc}"><xsl:value-of select="x:loc"/></a>
                <span>Last modified: <xsl:value-of select="x:lastmod"/></span>
            </xsl:for-each>
        </div>


        <style>

            .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            }

            @media screen and (max-width: 600px) {
            .container {
            grid-template-columns: 1fr;
            }
            }
        </style>
    </body>
</html>