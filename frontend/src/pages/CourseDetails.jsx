import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getCourseById } from '../api/course.js'
import { getLecturesForCourse } from '../api/lecture.js'
import { getReviewsByCourse, addReview } from '../api/review.js'
import { createPaymentOrder, verifyPayment } from '../api/payment.js'
import { getMe } from '../api/auth'
import { setUser } from '../redux/userSlice'

export default function CourseDetails() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lecturesError, setLecturesError] = useState(null)
  const [selectedLecture, setSelectedLecture] = useState(null)
  const [enrolling, setEnrolling] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.user?.user)

  const isLoggedIn = Boolean(authUser)
  const isEnrolled =
    isLoggedIn &&
    Array.isArray(authUser.enrolledCourses) &&
    authUser.enrolledCourses.some(
      (courseId) => String(courseId) === String(course?._id),
    )

  async function startPaymentFlow(order) {
    if (
      order?.provider === 'razorpay' &&
      window.Razorpay &&
      import.meta.env.VITE_RAZORPAY_KEY_ID
    ) {
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID
      return new Promise((resolve, reject) => {
        const options = {
          key,
          amount: Number(order.amount || 0) * 100,
          currency: order.currency || 'INR',
          name: order.courseTitle || 'Course purchase',
          order_id: order.providerOrderId,
          handler(response) {
            resolve({
              provider: 'razorpay',
              providerOrderId: order.providerOrderId,
              providerPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            })
          },
          modal: {
            ondismiss() {
              reject(new Error('Payment cancelled'))
            },
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      })
    }

    const confirmed = window.confirm(
      'Simulate successful payment for this course?'
    )
    if (!confirmed) {
      throw new Error('Payment cancelled')
    }

    return {
      provider: 'dev',
      orderId: order.orderId,
      success: true,
    }
  }

  async function handleEnrollClick() {
    if (!id || !isLoggedIn || isEnrolled || enrolling) return
    setEnrolling(true)
    try {
      const order = await createPaymentOrder(id)
      const paymentResult = await startPaymentFlow(order)

      const verifyPayload =
        paymentResult.provider === 'razorpay'
          ? {
              providerOrderId: paymentResult.providerOrderId,
              providerPaymentId: paymentResult.providerPaymentId,
              signature: paymentResult.signature,
            }
          : {
              orderId: paymentResult.orderId,
              success: true,
            }

      await verifyPayment(verifyPayload)
      try {
        const me = await getMe()
        if (me?.user) {
          dispatch(setUser(me.user))
        }
      } catch {
        // best-effort user refresh
      }
      toast.success('Payment verified. You can now access the course.')
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.message ||
        'Payment failed. Please try again.'
      toast.error(message)
    } finally {
      setEnrolling(false)
    }
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    setLecturesError(null)
    Promise.all([getCourseById(id), getLecturesForCourse(id)])
      .then(([courseData, lectureData]) => {
        setCourse(courseData)
        setLectures(Array.isArray(lectureData) ? lectureData : [])
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load course')
      })
      .finally(() => setLoading(false))
  }, [id])

  async function loadReviews() {
    if (!id) return
    setReviewsLoading(true)
    setReviewsError(null)
    try {
      const res = await getReviewsByCourse(id)
      setReviews(res?.reviews ?? [])
    } catch (err) {
      setReviewsError(err.response?.data?.message || err.message || 'Failed to load reviews')
    } finally {
      setReviewsLoading(false)
    }
  }

  useEffect(() => {
    if (!id || !course) return
    loadReviews()
  }, [id, course?._id])

  async function handleSubmitReview(e) {
    e.preventDefault()
    if (!id || reviewSubmitting) return
    setReviewSubmitting(true)
    try {
      await addReview({ courseId: id, rating: reviewRating, comment: reviewComment })
      toast.success('Review submitted')
      await loadReviews()
      const courseData = await getCourseById(id)
      setCourse(courseData)
      setReviewComment('')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to submit review')
    } finally {
      setReviewSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-sm text-slate-600">Loading course...</p>
      </main>
    )
  }

  if (error || !course) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-sm text-red-600">{error || 'Course not found'}</p>
        <Link to="/" className="mt-3 inline-block text-sm text-indigo-600 hover:underline">
          Back home
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row">
        <section className="flex-1">
          <header className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-semibold text-slate-900">{course.title}</h1>
            {(course.ratingAvg != null || course.ratingCount > 0) && (
              <p className="mt-1 text-sm text-slate-600">
                {course.ratingAvg != null ? `${Number(course.ratingAvg).toFixed(1)} ★` : ''}
                {course.ratingCount != null && course.ratingCount > 0
                  ? ` · ${course.ratingCount} review${course.ratingCount !== 1 ? 's' : ''}`
                  : ''}
              </p>
            )}
            {course.description && (
              <p className="mt-2 text-sm text-slate-700">{course.description}</p>
            )}
          </header>

          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Curriculum
            </h2>
            {lecturesError && (
              <p className="mt-2 text-sm text-red-600">
                {lecturesError}
              </p>
            )}
            {lectures.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No lectures available yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
                {lectures.map((lecture, index) => (
                  <li
                    key={lecture._id}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        <span className="mr-2 text-xs text-slate-400">
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </span>
                        {lecture.title}
                      </p>
                      {lecture.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                          {lecture.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isEnrolled ? (
                        <button
                          type="button"
                          onClick={() => setSelectedLecture(lecture)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Play
                        </button>
                      ) : lecture.isPreviewFree ? (
                        <>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Preview
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedLecture(lecture)}
                            className="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Play
                          </button>
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                          <span className="inline-block h-2 w-2 rounded-full bg-slate-400" />
                          Locked
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Reviews
            </h2>
            {isLoggedIn && isEnrolled && (
              <form onSubmit={handleSubmitReview} className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
                <label className="block text-sm font-medium text-slate-700">Your rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="mt-1 block w-full max-w-xs rounded border border-slate-300 px-3 py-2 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} ★</option>
                  ))}
                </select>
                <label className="mt-3 block text-sm font-medium text-slate-700">Comment (optional)</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Share your experience..."
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="mt-3 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit review'}
                </button>
              </form>
            )}
            {reviewsLoading && (
              <p className="mt-2 text-sm text-slate-500">Loading reviews...</p>
            )}
            {reviewsError && (
              <p className="mt-2 text-sm text-red-600">{reviewsError}</p>
            )}
            {!reviewsLoading && !reviewsError && (course.ratingCount == null || course.ratingCount === 0) && (
              <p className="mt-2 text-sm text-slate-500">No reviews yet.</p>
            )}
            {!reviewsLoading && !reviewsError && reviews.length > 0 && (
              <ul className="mt-3 space-y-3">
                {reviews.map((review) => (
                  <li
                    key={review._id}
                    className="rounded-lg border border-slate-200 bg-white p-3 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {review.userId?.avatar ? (
                        <img
                          src={review.userId.avatar}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                          {(review.userId?.name && review.userId.name[0]) || '?'}
                        </span>
                      )}
                      <span className="font-medium text-slate-800">
                        {review.userId?.name ?? 'Anonymous'}
                      </span>
                      <span className="text-amber-600">{review.rating} ★</span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-slate-600">{review.comment}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>

        <aside className="mt-4 w-full max-w-md space-y-4 md:mt-0">
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Access
            </h2>
            <div className="mt-3">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Login to enroll
                </Link>
              ) : isEnrolled ? (
                <Link
                  to={`/courses/${id}`}
                  className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Go to course
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {enrolling ? 'Starting payment...' : 'Enroll'}
                </button>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Preview player
            </h2>
          {!selectedLecture ? (
            <p className="mt-3 text-sm text-slate-500">
              Select a lecture marked as preview to watch its video.
            </p>
          ) : selectedLecture.isPreviewFree ? (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-800">{selectedLecture.title}</p>
              {selectedLecture.videoURL ? (
                <video
                  key={selectedLecture._id}
                  controls
                  className="mt-3 aspect-video w-full rounded bg-black"
                  src={selectedLecture.videoURL}
                />
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Video not uploaded yet.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              This lecture is locked. It will be available after you enroll in the course.
            </p>
          )}
          </section>
        </aside>
      </div>
    </main>
  )
}

