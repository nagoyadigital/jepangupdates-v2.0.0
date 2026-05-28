const fs = require('fs');
const xml = fs.readFileSync('./scripts/jepangupdates.xml', 'utf-8');

// Find attachments (images) and their URLs
const attachments = {};
const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;
while ((match = itemRegex.exec(xml)) !== null) {
  const item = match[1];
  const postType = (item.match(/<wp:post_type>(.*?)<\/wp:post_type>/) || [])[1];
  if (postType === 'attachment') {
    const postId = (item.match(/<wp:post_id>(.*?)<\/wp:post_id>/) || [])[1];
    const url = (item.match(/<wp:attachment_url>(.*?)<\/wp:attachment_url>/) || [])[1];
    if (postId && url) attachments[postId] = url;
  }
}

// Find thumbnail meta for posts
let withImage = 0;
let withoutImage = 0;
const postThumbs = {}; // slug -> image url

const itemRegex2 = /<item>([\s\S]*?)<\/item>/g;
while ((match = itemRegex2.exec(xml)) !== null) {
  const item = match[1];
  const postType = (item.match(/<wp:post_type>(.*?)<\/wp:post_type>/) || [])[1];
  if (postType !== 'post') continue;
  
  const slug = (item.match(/<wp:post_name>(.*?)<\/wp:post_name>/) || [])[1];
  const thumbMeta = item.match(/<wp:meta_key>_thumbnail_id<\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]><\/wp:meta_value>/);
  
  if (thumbMeta && attachments[thumbMeta[1]]) {
    withImage++;
    postThumbs[slug] = attachments[thumbMeta[1]];
  } else {
    withoutImage++;
  }
}

console.log('Total attachments:', Object.keys(attachments).length);
console.log('Posts WITH featured image:', withImage);
console.log('Posts WITHOUT featured image:', withoutImage);
console.log('\nSample images:');
Object.entries(postThumbs).slice(0, 5).forEach(([slug, url]) => {
  console.log(' ', slug, '->', url);
});
