import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {IoIosStar} from 'react-icons/io'
import {MdLocationOn} from 'react-icons/md'
import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
    isChecked: false,
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
    isChecked: false,
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
    isChecked: false,
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
    isChecked: false,
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
    isChecked: false,
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
    isChecked: false,
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
    isChecked: false,
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
    isChecked: false,
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: {},
    apiProfileStatus: apiStatusConstants.initial,
    jobsData: [],
    apiJobsStatus: apiStatusConstants.initial,
    employmentType: [],
    minimumPackage: [],
    search: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiProfileStatus: apiStatusConstants.inProgress})

    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: {...formattedData},
        apiProfileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiStatusConstants.failure})
    }
  }

  getJobsDetails = async () => {
    this.setState({apiJobsStatus: apiStatusConstants.inProgress})

    const {employmentType, minimumPackage, search} = this.state
    const employmentTypes = employmentType.join(',')
    const minimumPackages = minimumPackage.join(',')

    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${minimumPackages}&search=${search}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    console.log(url)
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const formattedData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobsData: formattedData,
        apiJobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-page">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }

  onClickRetryProfile = () => this.getProfileDetails()

  renderProfileFailureView = () => (
    <div className="failure-view">
      <button
        type="button"
        onClick={this.onClickRetryProfile}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderSpecificProfileView = () => {
    const {apiProfileStatus} = this.state

    switch (apiProfileStatus) {
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobsDataViews = prop => {
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = prop

    return (
      <li key={id} className="jobs-list-item">
        <Link to={`/jobs/${id}`} className="link-item">
          <div className="jobs-item-view">
            <div className="company-logo">
              <img
                src={companyLogoUrl}
                alt="company logo"
                className="job-company-logo-img"
              />
              <div className="company-title">
                <h1 className="company-title-heading">{title}</h1>
                <div className="rating-section">
                  <IoIosStar className="react-icons gold" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="company-details">
              <div className="detail-section">
                <MdLocationOn className="react-icons size" />
                <p className="details-title">{location}</p>
                <BsBriefcaseFill className="react-icons size" />
                <p className="details-title">{employmentType}</p>
              </div>
              <p className="package-title-heading">{packagePerAnnum}</p>
            </div>
            <hr className="hr-line" />
            <h1 className="rating spacing">Description</h1>
            <p className="details-title spacing">{jobDescription}</p>
          </div>
        </Link>
      </li>
    )
  }

  renderJobsView = () => {
    const {jobsData} = this.state

    return jobsData.length > 0 ? (
      <ul className="jobs-list-container">
        {jobsData.map(eachItem => this.renderJobsDataViews(eachItem))}
      </ul>
    ) : (
      <div className="failure-view spacing-top">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="failure-view-img"
        />
        <h1 className="failure-view-heading">No Jobs Found</h1>
        <p className="failure-view-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  onClickRetryJobs = () => this.getJobsDetails()

  renderJobsFailureView = () => (
    <div className="failure-view spacing-top">
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
        onClick={this.onClickRetryJobs}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderSpecificJobsView = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiStatusConstants.success:
        return this.renderJobsView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderEmploymentTypes = prop => {
    const {label, employmentTypeId} = prop

    const onClickOption = () => {
      /* const index = employmentTypesList.findIndex(
        eachItem => eachItem.employmentTypeId === employmentTypeId,
      )
      employmentTypesList[index].isChecked = !employmentTypesList[index]
        .isChecked
      const filteredEmploymentResult = employmentTypesList.filter(
        eachItem => eachItem.isChecked === true,
      )
      const employmentResult = filteredEmploymentResult.map(
        eachItem => eachItem.employmentTypeId,
      )

      // ---> output for 'result' will be like this: ['PARTTIME', 'FREELANCE']

      this.setState({employmentType: employmentResult}, this.getJobsDetails) */

      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, employmentTypeId],
        }),
        this.getJobsDetails,
      )
    }

    return (
      <li key={employmentTypeId} className="filter-list-item">
        <input
          id={label}
          type="checkbox"
          value={employmentTypeId}
          className="jobs-input-element"
          onClick={onClickOption}
        />
        <label htmlFor={label} className="label-element">
          {label}
        </label>
      </li>
    )
  }

  renderSalaryRanges = prop => {
    const {label, salaryRangeId} = prop

    const onClickOption = () => {
      /* const index = salaryRangesList.findIndex(
        eachItem => eachItem.salaryRangeId === salaryRangeId,
      )
      salaryRangesList[index].isChecked = !salaryRangesList[index].isChecked
      const filteredSalaryResult = salaryRangesList.filter(
        eachItem => eachItem.isChecked === true,
      )
      const salaryResult = filteredSalaryResult.map(
        eachItem => eachItem.salaryRangeId,
      )

      this.setState(
        {minimumPackage: salaryResult.join(',')},
        this.getJobsDetails,
      ) */

      this.setState(
        prevState => ({
          minimumPackage: [...prevState.minimumPackage, salaryRangeId],
        }),
        this.getJobsDetails,
      )
    }

    return (
      <li key={salaryRangeId} className="filter-list-item">
        <input
          id={label}
          type="radio"
          name="salary"
          value={salaryRangeId}
          className="jobs-input-element"
          onClick={onClickOption}
        />
        <label htmlFor={label} className="label-element">
          {label}
        </label>
      </li>
    )
  }

  onChangeSearchInput = event => {
    this.setState({search: event.target.value})
  }

  onPressEnter = event => {
    if (event.key === 'Enter') {
      this.getJobsDetails()
    }
  }

  onClickSearch = () => {
    this.getJobsDetails()
  }

  render() {
    const {search} = this.state

    return (
      <>
        <Header />
        <div className="jobs-route">
          <div className="filter-section">
            {this.renderSpecificProfileView()}
            <hr className="hr-line" />
            <h1 className="jobs-filter-heading">Type of Employment</h1>
            <ul className="jobs-list-container">
              {employmentTypesList.map(eachItem =>
                this.renderEmploymentTypes(eachItem),
              )}
            </ul>
            <hr className="hr-line" />
            <h1 className="jobs-filter-heading">Salary Range</h1>
            <ul className="jobs-list-container">
              {salaryRangesList.map(eachItem =>
                this.renderSalaryRanges(eachItem),
              )}
            </ul>
          </div>
          <div className="jobs-section">
            <div className="search-box">
              <input
                type="search"
                value={search}
                onKeyDown={this.onPressEnter}
                onChange={this.onChangeSearchInput}
                placeholder="Search"
                className="search-element"
              />
              <button
                type="button"
                onClick={this.onClickSearch}
                data-testid="searchButton"
                className="search-button"
              >
                {' '}
                <BsSearch className="react-icons" />
              </button>
            </div>
            {this.renderSpecificJobsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
