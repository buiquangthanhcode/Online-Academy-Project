import  Teacher from "../models/teacher.model.js";
import ChapterModel from '../models/Chapter.model.js';
import LessonModel from '../models/Lesson.model.js';
import TeacherSevice from "../services/Teacher.sevice.js";
import CourseModel from "../models/Course.model.js";
const GetAllTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.find();

    res.status(200).json({
      status: "success",
      length: teacher.length,
      teacher,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Missing require fail",
    });
  }
};

const CreateTeacher = async (req, res, id_account) => {
  const data = new Teacher({
    id_account: id_account,
    fullname: req.body.fullname,
    skill: req.body.skill,
    description: req.body.description,
  });

    const dataToSave = await data.save();
};

const DeleteTeacher = async (req, res, id_account) => {
  try {
    const id = req.params.id;
    const data = await Teacher.findOneAndDelete({ "id_account" : id_account})
    res.send(`Document with data has been deleted..`)
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "ID invalid",
    });
  }
};

const UpdateTeacher = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Teacher.findOneAndUpdate({ "id_account" : id}, req.body, {
      returnOriginal: false
    })
    res.status(200).send(data);
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "ID invalid",
    });
  }
};


const viewCreateCourse = async (req, res) => {
  
  const subCategorys = await TeacherSevice.getSubCategory();
  ChapterModel.find({}).lean().populate('lessons').exec(function (err, story) {
    if (err) return (err);
    console.log(subCategorys);

    res.render("Teacher/createCourse", { chapters: story, subCategory: subCategorys });
  });// Ch
}
const createCourse= async (req, res) => {
  try {
    const course = req.body;
    const chapter =   await TeacherSevice.getChapterByTime(course.chapter);
    const IDSubCategory = await TeacherSevice.getIDCategory(course.sub_category);
    console.log(course.sub_category);
    const file = req.files;
    const courseObject = {
      title: course.title,
      sub_category: IDSubCategory,
      subtitle: course.subtitle,
      description: course.description,
      author_id: course.author_id,
      number_review: course.number_review || 0,
      scores_review: course.scores_review || 0,
      list_reviews: course.list_reviews || [],
      image: file.image[0].path,
      price: course.price,
      lastUpdate: course.lastUpdate || 1970,
      promotion: course.promotion,
      syllabus: course.syllabus,
      videoDemo: file.videoDemo[0].path,
      chapter:  chapter || [],

    }
    console.log(courseObject);
    const course_Data = new CourseModel(courseObject);

    const value = await course_Data.save();

    if (value) {
      res.status(200).json(value);
    }
    else {
      res.status(200).json({ message: "Failed" });

    }
  } catch (error) {
    res.status(500).json(error);
  }
}
const homepage = (req, res) => {
  res.render('Teacher/home')};

const editCourse = (req, res) => {
  res.render("Teacher/editCourse");
};
const myListCourses = (req, res) => {
  res.render("Teacher/myListCourses");
};
export default { GetAllTeacher, CreateTeacher, DeleteTeacher, UpdateTeacher, viewCreateCourse, homepage, editCourse, myListCourses, createCourse }