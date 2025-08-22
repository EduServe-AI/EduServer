import passport from 'passport'
import { setupGoogleStrategy } from '../utils/google.strategy'
import { setupJwtStrategy } from '../utils/jwt.strategy'

const intializePassport = () => {
    setupJwtStrategy(passport)
    setupGoogleStrategy(passport)
}

intializePassport()
export default passport
