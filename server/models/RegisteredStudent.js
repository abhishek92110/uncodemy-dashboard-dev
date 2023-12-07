const mongoose = require("mongoose");

const RegisterStudentSchema = new mongoose.Schema({

    Name: {
        type: String,

    },
    Email: {
        type: String,

    },
    Number: {
        type: Number,

    },
    Pname: {
        type: String,


    },
    Pnumber: {
        type: String,


    },
    RegistrationDate: {
        type: String,

    },
    
    RegistrationFees: {
        type: String,

    },

    Course: {
        type: String,

    },

    Counselor: {
        type: String,

    },
    CounselorId: {
        type: String,

    },

    RegistrationFees: {
        type: String,

    },

    RegistrationNo: {
        type: String,

    },


    TrainerName: {
        type: String,

    },

    TrainerId: {
        type: String,

    },

    BatchMode: {
        type: String,

    },

    BatchTiming: {
        type: String,

    },
    subCourse: {
        type: String,

    },

    Remark: {
        type: String,
    },
    status: {
        type: String,
    },

});

const users = new mongoose.model("registeredStudents", RegisterStudentSchema);


module.exports = users;