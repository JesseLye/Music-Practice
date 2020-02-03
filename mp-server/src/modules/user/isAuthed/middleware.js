module.exports = async (
    resolver,
    parent,
    args,
    context,
    info
) => {
    return resolver(parent, args, context, info);
};