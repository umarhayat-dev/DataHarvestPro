import fetch from 'node-fetch';

async function testCoursesAPI() {
  const baseUrl = 'http://127.0.0.1:5000';
  let sessionCookie;

  try {
    // 1. Login as admin
    console.log('Testing admin login...');
    const loginRes = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'dev_password_replace_in_production'
      })
    });
    
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText}`);
    }
    
    sessionCookie = loginRes.headers.get('set-cookie');
    console.log('Login successful');

    // 2. Create a test course
    console.log('\nTesting course creation...');
    const createRes = await fetch(`${baseUrl}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify({
        title: 'Test Course',
        description: 'A test course description',
        price: "99.99",
        categoryId: 1,
        active: true,
        featured: false,

        image: null,
        duration: "8 weeks",
        instructorName: "Test Instructor",
        instructorTitle: null,
        instructorImage: null
      })

    });

    if (!createRes.ok) {
      const error = await createRes.text();
      throw new Error(`Course creation failed: ${createRes.status} ${createRes.statusText}\n${error}`);
    }

    const course = await createRes.json();
    console.log('Course created:', course);

    // Rest of the test cases...
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testCoursesAPI();
