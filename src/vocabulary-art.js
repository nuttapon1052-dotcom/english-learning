// Original AI-generated illustration atlases, visually checked against this explicit order.
// Do not derive positions from display sorting: IDs must keep their original image.
const groups = {
  "fruit": [
    "fruit:apple",
    "fruit:banana",
    "fruit:orange",
    "fruit:mango",
    "fruit:pineapple",
    "fruit:watermelon",
    "fruit:grape",
    "fruit:strawberry",
    "fruit:papaya",
    "fruit:coconut",
    "fruit:durian",
    "fruit:guava",
    "fruit:lemon",
    "fruit:lime",
    "fruit:peach",
    "fruit:pear"
  ],
  "animals": [
    "animals:cat",
    "animals:dog",
    "animals:bird",
    "animals:fish",
    "animals:rabbit",
    "animals:duck",
    "animals:chicken",
    "animals:cow",
    "animals:pig",
    "animals:horse",
    "animals:sheep",
    "animals:goat",
    "animals:elephant",
    "animals:tiger",
    "animals:lion",
    "animals:monkey",
    "animals:bear",
    "animals:snake",
    "animals:turtle",
    "animals:butterfly"
  ],
  "objects": [
    "objects:book",
    "objects:pen",
    "objects:pencil",
    "objects:notebook",
    "objects:bag",
    "objects:phone",
    "objects:key",
    "objects:wallet",
    "objects:watch",
    "objects:clock",
    "objects:table",
    "objects:chair",
    "objects:door",
    "objects:window",
    "objects:bed",
    "objects:pillow",
    "objects:cup",
    "objects:bottle",
    "objects:plate",
    "objects:spoon",
    "objects:fork",
    "objects:umbrella",
    "objects:shoes",
    "objects:glasses"
  ]
};
export const vocabularyArtwork = Object.fromEntries(Object.entries(groups).flatMap(([category,ids])=>ids.map((id,index)=>[id,{
 file:'vocab-art/'+category+'.png',columns:4,rows:ids.length/4,col:index%4,row:Math.floor(index/4)
}])));
export const vocabularyArtPreviews = {fruit:'fruit:apple',animals:'animals:cat',objects:'objects:book'};
