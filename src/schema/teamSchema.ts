import Joi from "joi";

const updateRoleTeamMemberSchema = Joi.object({
    role_to: Joi.string()
        .min(3)
        .max(3)
        .case('upper')
        .required()
})
.strict();

export default updateRoleTeamMemberSchema;