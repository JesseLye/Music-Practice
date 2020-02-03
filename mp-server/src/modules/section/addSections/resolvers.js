const {
    findSectionCheck
} = require("../conditions");
const {
    buildSongSection,
    buildExerciseSection
} = require("../utils");

exports.resolvers = {
    Mutation: {
        addSections: async (_, args, { req, models }) => {
            try {
                if (args.SongId && args.ExerciseId) {
                    throw "A Section can only be associated with either a Song or Exercise; not both."
                }
                if (!args.SongId && !args.ExerciseId) {
                    throw "Either a SongId or ExerciseId is required to add a Section";
                }
                let selectID = args.SongId ? "SongId" : "ExerciseId";
                const errors = await findSectionCheck(req, args[selectID], !!args.SongId);
                if (errors) {
                    throw errors;
                } else {
                    let buildFunction = args.SongId ? buildSongSection : buildExerciseSection;
                    let sectionArray = [];
                    for (let i = 0; i < args.input.length; i++) {
                        let createSectionObject = buildFunction(args, i);
                        const createSection = await models.Section.create(createSectionObject);
                        sectionArray.push(createSection);
                    }
                    return {
                        sections: sectionArray,
                        status: {
                            ok: true,
                        }
                    }
                }
            } catch (errMessage) {
                return {
                    status: {
                        ok: false,
                        errMessage: errMessage,
                    }
                }
            }
        }
    }
}