import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsBriefcaseFill} from 'react-icons/bs'
import {IoIosStar} from 'react-icons/io'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItem extends Component {
  state = {apiJobItemStatus: apiStatusConstants.initial, jobItemData: []}

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiJobItemStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs

      const formattedJobDetails = {
        skills: jobDetails.skills,
        lifeAtCompany: jobDetails.life_at_company,
      }

      const {skills, lifeAtCompany} = formattedJobDetails

      const formattedSkills = skills.map(eachItem => ({
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))

      const formattedLifeAtCompany = {
        imageUrl: lifeAtCompany.image_url,
        description: lifeAtCompany.description,
      }

      const formattedSimilarJobs = similarJobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      const formattedData = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
        skills: formattedSkills,
        lifeAtCompany: formattedLifeAtCompany,
        similarJobs: formattedSimilarJobs,
      }

      // console.log(formattedData)

      this.setState({
        jobItemData: formattedData,
        apiJobItemStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobItemStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryJobItem = () => this.getJobItemDetails()

  renderJobItemFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        onClick={this.onClickRetryJobItem}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderSkillsView = skill => {
    const {imageUrl, name} = skill

    return (
      <li key={name} className="skills-list-item">
        <img src={imageUrl} alt={name} className="skill-img" />
        <p className="skill-title">{name}</p>
      </li>
    )
  }

  renderJobItemView = () => {
    const {jobItemData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompany,
      similarJobs,
    } = jobItemData

    const {imageUrl, description} = lifeAtCompany

    return (
      <div className="job-item-page">
        <div className="job-item-view">
          <div className="company-logo-view">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-item-company-logo-img"
            />
            <div className="company-title">
              <h1 className="company-title-heading-lg">{title}</h1>
              <div className="rating-section">
                <IoIosStar className="react-icons gold-lg" />
                <p className="rating-lg">{rating}</p>
              </div>
            </div>
          </div>
          <div className="company-details">
            <div className="detail-section">
              <MdLocationOn className="react-icons size-lg" />
              <p className="details-title-lg">{location}</p>
              <BsBriefcaseFill className="react-icons size-lg" />
              <p className="details-title-lg">{employmentType}</p>
            </div>
            <p className="package-title-heading-lg">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line-lg" />
          <div className="about-link-section">
            <h1 className="job-item-heading-lg">Description</h1>
            <a href={companyWebsiteUrl} className="link-item">
              <p className="visit-link">
                Visit <FiExternalLink className="react-icons size blue" />
              </p>
            </a>
          </div>
          <p className="company-description-lg">{jobDescription}</p>
          <h1 className="job-item-heading-lg job-item-spacing">Skills</h1>
          <ul className="job-item-list-container">
            {skills.map(eachItem => this.renderSkillsView(eachItem))}
          </ul>
          <h1 className="job-item-heading-lg">Life at Company</h1>
          <div className="life-at-company-section">
            <p className="company-description-lg width">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <h1 className="job-item-heading-lg job-item-spacing-top">
          Similar Jobs
        </h1>
        <ul className="job-item-list-container">
          {similarJobs.map(eachItem => (
            <SimilarJobs key={eachItem.id} jobItemDetails={eachItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderSpecificView = () => {
    const {apiJobItemStatus} = this.state

    switch (apiJobItemStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemView()
      case apiStatusConstants.failure:
        return this.renderJobItemFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-page">{this.renderSpecificView()}</div>
      </>
    )
  }
}

export default JobItem
