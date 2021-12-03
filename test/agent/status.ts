import { StatusCodes } from 'http-status-codes'

export const requestOpitons: {
  success?: boolean
  unauthorized?: boolean
  badRequest?: boolean
  forbidden?: boolean
  notFound?: boolean
} = {
  success: true,
  unauthorized: false,
  badRequest: false,
  forbidden: false,
  notFound: false,
}

export const expectStatus = (
  { badRequest, unauthorized, forbidden, notFound } = requestOpitons,
  defaultCode = StatusCodes.OK
) => {
  if (badRequest) return StatusCodes.BAD_REQUEST
  if (unauthorized) return StatusCodes.UNAUTHORIZED
  if (forbidden) return StatusCodes.FORBIDDEN
  if (notFound) return StatusCodes.NOT_FOUND

  return defaultCode
}
