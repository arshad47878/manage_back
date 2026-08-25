import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


const PORT = 8000;
const JWT_SECRET = "Arshad"

const data = [
  { id: 1, name: 'Arshad Qureshi', phone: '123-456-7890', fatherName: 'Qureshi',  
    localAddress: '789 Elm St, Village, Country', permanentAddress: '456 Oak Ave, Town, Country', email: 'arshad@example.com' },
  { id: 2, name: 'Prateek', phone: '234-567-8901', fatherName: 'Ramesh Kumar',  
    localAddress: '123 Main St, City, Country', permanentAddress: '456 Oak Ave, Town, Country', email: 'prateek@example.com' },
  { id: 3, name: 'Praveen', phone: '345-678-9012', fatherName: 'Suresh Kumar', 
     localAddress: '456 Oak Ave, Town, Country', permanentAddress: '789 Maple Dr, City, Country', email: 'praveen@example.com' },
];

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send(data);
});

app.post('/api/v1/students', (req, res) => {
  
  const newStudent = {
    // id: data.length + 1,
    id : Math.max(...data.map(student => student.id)) + 1,
    ...req.body,
  };

  data.push(newStudent);
  res.status(201).json(newStudent);
}); 

app.put('/api/v1/students/:id', (req, res) => {
  const id = Number(req.params.id);

  const student = data.find((student) => student.id === id);

  if (!student) {
    return res.status(404).json({
      message: 'Student not found'
    });
  }

  student.name = req.body.name;
  student.phone = req.body.phone;
  student.fatherName = req.body.fatherName;
  student.localAddress = req.body.localAddress;
  student.permanentAddress = req.body.permanentAddress;

  res.status(200).json(student);
});


app.delete('/api/v1/students/:id', (req, res) => {
  const id = Number(req.params.id);

  const student = data.find((student) => student.id === id);

  if (!student) {
    return res.status(404).json({
      message: 'Student not found'
    });
  }

  const updatedData = data.filter((student) => student.id !== id);

  data.length = 0;
  data.push(...updatedData);

  res.status(200).json({
    message: 'Student deleted successfully',
    student
  });
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

    const existingUser = data.find((user) => user.email === email);
    
    if(!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10); 

    // what is salt (10)? 
    // Salt is a random string that is added to the password before hashing to make it more secure.
    // It helps protect against dictionary attacks and rainbow table attacks.
    // why 10?
    // The number 10 represents the cost factor for the hashing algorithm. 
    // A higher cost factor means more computational work is required to hash the password, making it more secure but also slower to compute.
    

    const newUser = {
      id: data.length + 1,
      name,
      email,
      password: hashedPassword
    };

    data.push(newUser);
    res.status(201).json(newUser);
});

app.post('/login', (req, res) => {
 const {email, password} = req.body;
 if(!email || !password) {
    return res.status(400).json({ message: 'email, and password are required' });
  }
  const user = data.find((user) => user.email === email);
  if(!user) {
    return res.status(401).json({ message: 'invalid credentials' });
  }
  const passwordmatch = bcrypt.compare(password,data.password);
  
  if(!passwordmatch) {
    return res.status(401).json({ message: 'invalid credentials' });
  }
  const token = jwt.sign({id : data.id , email:data.email} , JWT_SECRET);

  res.json({
    message : "Login Successful"
  })

})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});