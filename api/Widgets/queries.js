import Widgets from './Widgets';

export default {
  widgets: (parent, args, context) =>
    context.user && context.user._id ? Widgets.find().fetch() : [],
  myWidgets: (parent, args, context) =>
    context.user && context.user._id ? Widgets.find({ createdById: context.user._id }).fetch() : [],
  widget: (parent, args, context) =>
    Widgets.findOne({
      $or: [
        { _id: args._id, createdById: context.user && context.user._id ? context.user._id : null },
      //  { _id: args._id, isPublic: true },
      ],
    }),
};
