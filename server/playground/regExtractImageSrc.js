// const html = '<img src="http://static2.ccn.com/ccs/2013/02/CC_1935770_challenge_accepted_pack_x3_indivisible.jpg" />';
const html = '<img class="provider-logo" src="https://photos.zillowstatic.com/fp/98ab7c7b2895c2f5f278917766712625-zillow_web_48_23.jpg" alt="Listing provided by ABOR" aria-hidden="false">';

const re = /<img[^>]+src="https:\/\/([^">]+)/g
const results = re.exec(html);
// console.log(results);
const source = results[1];
console.log(source);