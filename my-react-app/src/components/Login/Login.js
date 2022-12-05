import React, { useContext } from 'react';
import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../../utils/refreshToken';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { LangContext, PrevLangContext } from '../../App';

const clientId = '1061498518280-61io1snf32r4vai9ghighvuio2b2n30r.apps.googleusercontent.com';

const Login = () => {
  const { lang } = useContext(LangContext)
  const { prevLang } = useContext(PrevLangContext)
  const [google, setGoogle] = React.useState('Login with Google')
  const [log, setLog] = React.useState('If you are an Employee or a Manager: Sign In')
  const [btn, setBtn] = React.useState('Login')
  const [name, setName] = React.useState('Email')
  const [pass, setPass] = React.useState('Password')

  React.useEffect(() => {
    let t = [google, log, btn, name, pass]
    let text = t.join(';')
    if (lang !== prevLang) {
      const API_KEY = 'AIzaSyANYWkU1YhvNE5flUIvzJv8g-y0KCHva-0'
      let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`
      url += '&q=' + encodeURI(text)
      url += `&source=${prevLang}`
      url += `&target=${lang}`
      let translated = new Promise(function (resolve, reject) {
        fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        })
          .then(res => res.json())
          .then((response) => {
            //console.log("response from google: ", response.data.translations[0].translatedText)
            resolve(response.data.translations[0].translatedText)
          })
          .catch(error => {
            if (lang !== 'en') {
              alert("There was an error during translation. Reverting back to English")
              window.location.reload(false)
            }
          })
      })
      translated.then((result) => {
        var split = result.split(';')
        console.log(split)
        setGoogle(split[0])
        setLog(split[1])
        setBtn(split[2])
        setName(split[3])
        setPass(split[4])
      })
    }
  }, [prevLang, lang, google, log, btn, pass, name])

  // Terrible sphaghetti code, will fix later
  const onSuccess = (res) => {
    console.log("Login success");
    const email = res.profileObj.email.replace('@', '%40');
    const googleID = res.profileObj.googleId;

    refreshTokenSetup(res);

    const idRequest = 'http://localhost:8081/employee/getID?email=' + email;
    let employeeID = -1
    fetch(idRequest, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }

      response.json().then(json => {
        employeeID = parseInt(json);
      })
    })

    const loginRequest = 'http://localhost:8081/login?name=' + email + '&id=' + googleID;
    fetch(loginRequest, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }

      response.json().then(json => {
        console.log(json);
        if (parseInt(json) == 2) {
          localStorage.setItem("user", JSON.stringify({ username: email, password: googleID, role: "manager" }))
        }
        else if (parseInt(json) == 1) {
          localStorage.setItem("user", JSON.stringify({ username: email, password: googleID, role: "employee" }))
        }
        if (parseInt(json) == 1 || parseInt(json) == 2) {
          console.log("Got here")
          navigate('../employee', {
            state: {
              employeeID: employeeID,
              managerStatus: parseInt(json)
            }
          });
        }
      })
    })


  };

  const onFailure = (res) => {
    console.log("Login failure");
    console.log(res);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(event.target.elements.username.value) // from elements property
    // console.log(event.target.username.value)    
    // or directly
    const username = event.target.username.value
    const password = event.target.password.value
    // if (username && password) {
    //   localStorage.setItem("user", JSON.stringify({ username: username, password: password, role: "manager" }))
    // }

    // console.log(event.target.password.value) // from elements property
    // console.log(event.target.username.value)          // or directly

    const idRequest = 'http://localhost:8081/employee/getID?email=' + event.target.username.value;
    const encodedIDRequest = idRequest.replace('@', '%40');
    let employeeID = -1
    fetch(encodedIDRequest, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }

      response.json().then(json => {
        employeeID = parseInt(json);
      })
    })

    const loginRequest = 'http://localhost:8081/login?name=' + event.target.username.value.replace('@', '%40') + '&id=' + event.target.password.value;
    fetch(loginRequest, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
    }).then(response => {
      console.log(response)
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }

      response.json().then(json => {
        console.log(json)
        if (parseInt(json) == 2) {
          localStorage.setItem("user", JSON.stringify({ username: username, password: password, role: "manager" }))
        }
        else if (parseInt(json) == 1) {
          localStorage.setItem("user", JSON.stringify({ username: username, password: password, role: "employee" }))
        }
        if (parseInt(json) == 1 || parseInt(json) == 2) {
          navigate('../employee', {
            state: {
              employeeID: employeeID,
              managerStatus: parseInt(json)
            }
          });
        }
      })
    })

  }

  const navigate = useNavigate();
  return (
    <div>
      <form onSubmit={handleSubmit} className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">{log}</h3>
          <div className="form-group">
            <input
              className="login-input"
              name="username"
              placeholder={name}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              className="login-input"
              placeholder={pass}
            />
          </div>
          <div className="">
            <button type="submit" className="submit-button">
              {btn}
            </button>
          </div>
        </div>
      </form>
      <div>

      </div>
      <GoogleLogin
        clientId={clientId}
        buttonText={google}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={false}
      />
    </div>
  );
};

export default Login;