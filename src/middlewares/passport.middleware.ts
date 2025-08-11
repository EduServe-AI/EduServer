import passport from 'passport'
import { setupJwtStrategy } from '../utils/jwt.strategy'

const intializePassport = () => {
    setupJwtStrategy(passport)
}

intializePassport()
export default passport
