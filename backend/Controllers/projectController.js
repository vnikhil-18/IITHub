const asyncHandler = require('express-async-handler');
const Project = require('../Models/projectModel');
const User = require('../Models/userModel');
const projectDetails = require('../Models/projectModel');
const binary = require('mongodb').Binary;
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');

const addProject = asyncHandler(async (req, res) => {
    if (req.files) {
        if(req.files.file.size>1024*1024*16){
            res.status(400);
            throw new Error("File too large");
        }
        const fileData = req.files.file.data;
        const binaryData = Buffer.from(fileData, 'base64');
        const { title, professor, institute, description, abstract ,pic} = req.body;
        const projectData = {
            title,
            professor,
            institute,
            description,
            abstract,
            user: req.user._id,
            file: new binary(binaryData),
            pic:pic,
            fileName: req.files.file.name
        };
        try {
            const newProject = await Project.create(projectData);
            res.status(200).send(newProject);
        } catch (error) {
            res.status(400);
            console.log(error.message);
        }
    }
    else {
        const { title, professor, institute, description, abstract,pic } = req.body;
        console.log(pic);
        const projectData = {
            title:title,
            professor:professor,
            institute:institute,
            description:description,
            abstract:abstract,
            user: req.user._id,
            img:pic
        };
        try {
            const newProject = await Project.create(projectData);
            res.status(200).send(newProject);
        } catch (error) {
            res.status(400);
            console.log(error.message);
        }
    }
});

const deleteProject = asyncHandler(async (req, res) => {
    const projectId  = req.params.projectId;
    console.log(projectId);
    try {
        const result = await projectDetails.findByIdAndDelete(projectId);

        if (result === null) {
            res.status(404).send("Project not found");
        } else {
            res.status(200).send("Project deleted");
            console.log(result);
        }
    } catch (error) {
        res.status(400).send(error.message);
        console.log(error.message);
    }
});

const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({}).populate('user');
    res.status(200).send(projects);
});

const downloadFile = asyncHandler(async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) {
            res.status(404);
            throw new Error("Project not found");
        }
        let buffer=project.file;
        console.log(project.fileName);
        let name=Date.now()+project.fileName;
        fs.writeFileSync(path.join(__dirname, '../../frontend/public', name), buffer);
        
        res.json({status:name}).status(200);
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
});

module.exports = { addProject, deleteProject, getProjects, downloadFile}