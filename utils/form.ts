import { sanitize } from 'dompurify'
import { toastError } from '../components/Toaster'

export const getSanitizedValue = (value: string) => {
  return sanitize(value, {
    USE_PROFILES: {
      html: false,
      svg: false,
      mathMl: false,
      svgFilters: false,
    },
  })
}

export const handleValidation = (
  validationMapping: any,
  fieldsWithError: any,
  setFieldsWithError: any,
  onSuccess: () => void
) => {
  const validatedFields = Object.values(validationMapping).map((field: any) => {
    let valid = false

    if (!field.optional) {
      valid = field.regex.test(field.value)
    } else {
      if (field.value) {
        valid = field.regex.test(field.value)
      } else {
        valid = true
      }
    }

    return {
      ...field,
      valid: valid,
    }
  })

  const updatedFieldsWithError = validatedFields.reduce((acc, cur) => {
    return {
      ...acc,
      [cur.key]: !cur.valid,
    }
  }, fieldsWithError)

  setFieldsWithError(updatedFieldsWithError)

  const invalidFields = validatedFields.filter(field => !field.valid)

  if (invalidFields.length) {
    toastError(invalidFields[0].error)
  } else {
    onSuccess()
  }
}
