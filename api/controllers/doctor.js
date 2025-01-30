import appointMentSchema from "../models/DoctorAppointMent.js";
import OurServices from "../models/PatientsServices.js";
import reviewSchema from "../models/ReviewsModal.js";
import Users from "../models/Users.js";


export const appointMentByDate = async (req, res, next) => {
    try {
      const { id, isAdmin, isDoctor } = req.user;
      const { date } = req.body;

      if (!date) {
        throw new AppError(400, 'Appointment date is required');
      }

      let appointments;

      if (isDoctor) {
        appointments = await appointMentSchema.find({
          isDoctor: id,
          doctor_id: id
        }).populate('user_id', 'username email');
      } else if (isAdmin) {
        appointments = await appointMentSchema.find({
          appointmantDate: date
        }).populate(['user_id', 'doctor_id']);
      } else {
        appointments = await appointMentSchema.find({
          appointmantDate: date,
          user_id: id
        }).populate('doctor_id', 'username email');
      }

      logger.info(`Appointments retrieved for date: ${date}`);
      res.status(200).json({
        status: 'success',
        data: appointments
      });
    } catch (err) {
      next(err);
    }
};
export const AddServices = async (req, res, next) => {
    const serviceData = new OurServices(req.body);
    try {
        const services = await serviceData.save();
        res.status(200).json(services);
    } catch (err) {
        next(err);
    }
}
export const ServicesList = async (req, res, next) => {
    try {
        const services = await OurServices.find();
        res.status(200).json(services);
    } catch (err) {
        next(err)
    }
}

export const DoctorList = async (req, res, next) => {
    const { email } = req.query;
    try {
        if (email) {
            const doctorList = await Users.find({ email: email })
            res.status(200).json(doctorList);
        } else {
            const doctorList = await Users.find({ isDoctor: true })
            res.status(200).json(doctorList);
        }
    }
    catch (err) {
        next(err);
    }
}
export const UpdateUserInfo = async (req, res, next) => {
    try {
        const response = await Users.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(response)
    } catch (err) {
        next(err)
    }
}

export const AddAppointMentCollection = async (req, res, next) => {
    const saveAppoint = new appointMentSchema(req.body)
    try {
        const addpointment = await saveAppoint.save();
        res.status(200).json(addpointment)
    }
    catch (err) {
        next(err);
    }
}

//Appopintment PatientList
export const AppointmentPatientsList = async (req, res, next) => {
    const { id, isAdmin, isDoctor } = req.user;
    
    try {
        if(isDoctor){
            const patientList = await appointMentSchema.find({doctor_id:id});
            res.status(200).json(patientList);
        }
        else if(isAdmin) {
            const appointmentPatients = await appointMentSchema.find({});
            res.status(200).json(appointmentPatients);
        } 
        else {
            const appointmentPatients = await appointMentSchema.find({ user_id: id });
            res.status(200).json(appointmentPatients);
        }
    }
    catch (err) {
        next(err);
    }
}

export const IsDoctor = async (req, res, next) => {
    const docEmail = req.body.email;
    try {
        const isDoc = await Users.findOne({ email: docEmail })
        if (isDoc.isDoctor = true) {
            const { password, ...others } = isDoc._doc;
            res.status(200).json({ ...others })
        }
        else {
            res.status(200).json(false)
        }
    }
    catch (err) {
        next(err);
    }
}

//Reviews

export const AddReview = async (req, res, next) => {
    const savedData = new reviewSchema(req.body);
    try {
        const saveReview = await savedData.save();
        res.status(200).json(saveReview);
    } catch (err) {
        next(err)
    }
}
export const ReviewsList = async (req, res, next) => {
    try {
        const response = await reviewSchema.find({});
        res.status(200).json(response)
    }
    catch (err) {
        next(err)
    }
}