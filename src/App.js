import React from 'react'
import styles from './App.module.css'
import { BsArrowReturnLeft, BsArrowLeft } from 'react-icons/bs'
import Spinner from 'react-spinkit'
import axios from 'axios'
import { TypeAnimation } from 'react-type-animation'


/** The main function of the application. */
function App() {
  const [data, setData] = React.useState({ name: '', age: null, submitted: false, error: null })

  /** onChange handler for the input field. */
  const handleName = e => {
    // Grab the first name.
    const firstName = e.target.value.split(' ')[0]

    setData(prev => ({ ...prev, name: firstName }))
  }

  /** onSubmit handler the form. */
  const handleSubmit = async e => {
    e.preventDefault()

    // You should not be able to submit form without a name.
    if (!data.name) {
      return
    }

    setData(prev => ({ ...prev, submitted: true }))

    // Get age prediction for name and store it in state.
    await getAgePrediction()
  }

  /** onClick handler for the "backward" button. */
  const handleBackButton = () => {
    setData(prev => ({ name: '', age: null, submitted: false, error: null }))
  }

  /** Get age predication for a name. */
  const getAgePrediction = async () => {
    const url = 'https://api.agify.io?name=' + data.name

    try {
      const response = await axios.get(url)
      const { age } = response.data

      setData(prev => ({ ...prev, age: age ? age : -1 }))
    } catch(error) {
      setData(prev => ({ ...prev, error: 'Någonting gick fel. Prova igen senare!' }))
    }
  }

  /** Render the form that accepts a name. */
  const renderFormView = () => {
    return (
      <div>
        <h1>Age Predictor</h1>
        <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={data.name}
                  onChange={handleName}
                  placeholder="Enter your first name"
                  autoFocus
                  className={styles.input}
                />
                <button
                  type="submit"
                  disabled={!data.name}
                  className={styles.btn}
                >
                  <BsArrowReturnLeft />
                </button>
            </div>
          </form>
        </div>
    )
  }

  /** Render the correct view after the form has been submitted. */
  const renderResultView = () => {
    if (data.error) {
      return renderErrorView()
    } else if (data.age) {
      return renderSuccessView()
    } else {
      return renderLoadingView()
    }
  }

  /** Render the successView if submitting was successful. */
  const renderSuccessView = () => {
    const { age } = data
    const sentence = `Hello, ${renderName()}!`

    return (
      <div>
        <button className={styles.backBtn} onClick={handleBackButton}><BsArrowLeft /></button>

        <div className={styles.teacherContainer}>
          <span className={styles.teacher}>👩‍🔬</span>

          <div className={styles.speechBubble}>
            <TypeAnimation
              sequence={[
                600,
                sentence + `${age === -1 ? ' Sorry, I can\'t predict your age.' : ` I predict your age is ${age}.`}`,
              ]}
              repeat="0"
              speed="20"
            />
            <div className={styles.triangle}></div>
          </div>

        </div>
      </div>
    )
  }

  /** Render the loading view (while consulting the API). */
  const renderLoadingView = () => {
    return (
      <div>
        <Spinner name='three-bounce' fadeIn='none' color='white' />
      </div>
    )
  }

  /** Render the error view. */
  const renderErrorView = () => {
    return (
      <div>
        <p>Error!</p>
      </div>
    )
  }

  /** Handle the rendering of name.  */
  const renderName = () => {
    const { name } = data

    // Cut the name short if it's too long.
    if (name.length > 20) {
      return name.substring(0, 20) + '..'
    } else {
      return name
    }
  }

  /** Return statement. */
  return (
    <div className={styles.container}>
      { data.submitted ? renderResultView() : renderFormView() }
    </div>
  )
}

export default App
