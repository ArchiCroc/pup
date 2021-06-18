import { Meteor } from 'meteor/meteor';

export default function getRandomUserId(query: any) {

  const count = Meteor.users.find(query, {fields: { _id: 1}}).count();
  if(count == 0) {
    return null;
  }
  
  const skip = Math.floor(Math.random() * count);

  const result = Meteor.users.findOne(query, { skip, fields: { _id: 1} });
  if(result){
    return result._id;
  }
  return null;

    /*  
    const pipeline = [{ $sample: { size: 1 } }]
    if(query) {
        pipeline.unshift({ $match: query });
    }

    const result = await Meteor.users.rawCollection().aggregate(pipeline, {}).toArray();
*/

}
