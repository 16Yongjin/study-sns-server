import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common'
import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No data submitted')
    }

    const { metatype } = metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Input data validation failed',
        errors: this.buildError(errors),
      })
    }
    return value
  }

  private buildError(errors: ValidationError[]) {
    const result = {}
    errors.forEach((el) => {
      const prop = el.property
      Object.values(el.constraints).forEach((error) => {
        result[prop] = error
      })
    })
    return result
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find((type) => metatype === type)
  }
}
