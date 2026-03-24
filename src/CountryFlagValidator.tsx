import { useState } from 'react'

type CountryFlagValidatorProps = {
  password: string
}

const countries = [ "AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW"];

function getRandomCountryCode() {
  return countries[Math.floor(Math.random() * countries.length)]
}

function CountryFlagValidator({ password }: CountryFlagValidatorProps) {
  const [selectedCountry] = useState<string>(() => getRandomCountryCode())
  const [isFlagUnavailable, setIsFlagUnavailable] = useState(false)

  const normalizedPassword = password.toUpperCase()
  const includesCountryCode =
    password.length > 0 && normalizedPassword.includes(selectedCountry)
  const flagUrl = `https://countryflagsapi.netlify.app/flag/${selectedCountry}.svg`

  return (
    <section className="country-flag-validator mt-4">
      <p className="section-label mb-2">Pravidlo: zkratka statu</p>
      <p className="helper-text mb-2">
        Heslo musi obsahovat zkratku zeme v Country code alpha-2
      </p>

      {!isFlagUnavailable ? (
        <img
          className="country-flag mb-2"
          src={flagUrl}
          alt={`Vlajka statu ${selectedCountry}`}
          width={96}
          height={64}
          onError={() => setIsFlagUnavailable(true)}
        />
      ) : (
        <p className="warning-text mb-2">Vlajku se nepodarilo nacist z API.</p>
      )}

      {password.length === 0 ? (
        <p className="helper-text mb-0">
          Zadejte heslo pro kontrolu tohoto pravidla.
        </p>
      ) : includesCountryCode ? (
        <p className="time-success mb-0">
          Heslo obsahuje zkratku zeme: {selectedCountry}.
        </p>
      ) : (
        <p className="warning-text mb-0">
          Heslo neobsahuje zkratku zeme: {selectedCountry}.
        </p>
      )}
    </section>
  )
}

export default CountryFlagValidator
