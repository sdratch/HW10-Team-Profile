const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Choice = require("inquirer/lib/objects/choice");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

const team = [];
let willContinue = true;
let idCount = 0;

loopEmploees();
async function loopEmploees(){
  while (willContinue) {
    //call the async function to get one employee
   willContinue = await getEmployee();

   //Check to make sure there is a manager on the team
   //If there is not then send them back to making employees
   if(!willContinue && !(team.some((employee) => employee.getRole() === "Manager"))){
     console.log("Need a manager on team")
     idCount--;
     willContinue = true;
   }
   //increase the id count
   idCount++;
  }
  //render the html look
  const html = render(team)
  //write the html file to the output foler
  fs.writeFile("./output/team.html", html, (err)=>{
    if(err){
      console.log(err)
    }
    console.log("Created html Successfully")
   
  })
}

//function to get employees
async function getEmployee() {
  try {
    //start first inquirer to get name, and email role
    const {name,email,role} = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter employee's name: ",
      },
      {
        type: "input",
        name: "email",
        message: "Enter employee's email: ",
      },
      {
        type: "list",
        name: "role",
        message: "Enter employee's role: ",
        choices: ["Manager", "Engineer", "Intern"],
      },
    ]);
    //The next prompt depends on the role of the employee so this switch case determines the next prompt
    let roleSpecificPrompt;
    switch (role) {
      case "Manager":
        roleSpecificPrompt = "Enter office number: ";
        break;
      case "Engineer":
        roleSpecificPrompt = "Enter github profile: ";
        break;
      case "Intern":
        roleSpecificPrompt = "Enter school: ";
        break;
    }
    //A second in inquirer to get the specific question based on the role
    const {specific} = await inquirer.prompt([
      {
        type: "input",
        name: "specific",
        message: roleSpecificPrompt,
      },
    ]);
    //Another switch case to create the employee based on the data gatherd
    let employee;
    switch (role) {
      case "Manager":
         employee = new Manager(name,idCount,email,specific);
        break;
      case "Engineer":
         employee = new Engineer(name,idCount,email,specific);
        break;
      case "Intern":
         employee = new Intern(name,idCount,email,specific);
        break;
    }
    //push the new employee into an array
    team.push(employee);
    //a third prompt to decided to continue adding more empolyee or to return false
    const { addMore } = await inquirer.prompt([
      {
        type: "confirm",
        name: "addMore",
        message: "Add more employees?",
      },
    ]);
    return addMore;
  } catch (err) {
    console.log(err);
  }
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
