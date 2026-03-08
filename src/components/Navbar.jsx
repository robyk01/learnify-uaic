import { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { SubjectContext } from "./SubjectContext";

import { Home, Code, Trophy, Settings, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
    const { selectedSubject, setSelectedSubject, closeSubject, handleSubjectClick } = useContext(SubjectContext);
    const [profile, setProfile] = useState(null)
    const [openProfile, setOpenProfile] = useState(null)
    const [subjects, setSubjects] = useState([]);
    const [navOpen, setNavOpen] = useState(false)

    const meshGradientUrls = [
        "https://colorflow.ls.graphics/embed.html#N4IgbgpgTgzglgewHYgFwEYAMAaEBzKOAEzVCgQHcY0AWXAYwQBtrU6QAHBOJAF1YDaA0MTQh6eALYBmdAgghc5Cmhzjmq3F3i9EKVKAAemkAE9VAXwbMEUUiDupMAOnQBOAGzpceVc4BMHv4A7LgARn7SAByY7ACGaOhWIAAWcUhETBCsoGkZWQAyEABmvPbGTrjmTsl5mRAASnB4KWUGIBUu6NI9VZa4dVkAqhzlJtWYten1ACKU+kbjft09ybymHAqoIDCSCAi8KSAWViIk29IArGEpeACu9IoOlCaMTIlaCDp6Y6iBHs4PEDQmZlrEktYmLZ7I4XFEfH4olF-OwIhhcAkMFN8tl7IMIEVSr8ALQufyYEJ9VCk5yYCn+bH1JotNqLJwBCkgia0+mM4ajdqdKmTAbTLJzCgLDpoGkU6LC1w9aRrDZbHZ7A5HE7YM5iCAQABW6Bg0jgT2Urw0f0+32Qv0uPWcSukwuSb2h7Vhznh+ERyNRHxAmIhqTFuPa+MJrOl1K6StdopxzNavzjvVBNUT9RGqYToZxEqlFVl-hRCvQ-mRKs2Yl2+0Ox1OIFE2wAjpI7gAvUyZc0vSrqd6oF2cL5wXR2wVoGJqCZumyOMiIhHspFlkBo7xBxJ88O5MNRklpkdzrNZZPRoUZkX57MCtmz-q38XzXPX2nBQLVtV1zWNgC62DCM25ycG4SAGpc9BuH2KjooOJjaOOPxTgO1Tkje7qLg4yyeFuvjsoElIbpEMTxDuZ57s+BIlJeSyZtRF6poq6bcpgFa7jmqGPrGtJuG4NC7oWb5sfxgm4OsNbbL+Dbarq2wANYKcEhhwHcoxKP2W5vIGSETkWaD+NEgJRJc7DVOgNBRM4biyOJg4eku7IeP6K4uME8YkauQQgsGu45NRh6oTS6CWf4VKypgwQhviTHca4YUKnS0WcfeMYuHS6CXBFGWYFEyqUcJwW5VlSV5QVICST+GqyU2LYbhw9xEFFsGBjp1qjraBlsOg1mYB40VUoElzODQly9fOULYV6PoEXCrleVufmUQFka0UeLEnjKuWYBVsXNCm8UrFt7J0rtqXMRS2UZiFSpCa+xW0v413csd361jVWp1aBCkQIYxQ0JICiaXB2lWiOekoWyM5DXSk2OThq5ud6C2bhiFHUatB7rY9x1JaFUS7nFD55viXFspF-hbtUNLSCElz3ZKl0UtTkT0+90mfQBQHySARBwBwnadkQCQg4ZkKIWO+kibQcOQgjXohFE7BzQEdnhJEwQeNdy2Y3i2NEtxpNhsT6V8dIHj4-4bgXUbN3Hoz3U8Q7Emqh99ZfTqIFiMpUAQF8MFix17VbpDk5skZNCuFE6CWxmlyYCNwTJ4T8vTX4REgqrcrXWiGVGTrGP4ljOJBRTx45U9VlEwddHsnj74UtXlHk2bZ1cttipfoVD3lzyUXlnTHgc+qHuNl79V3GAcQ0FlHitcHVrhZ1yHhzGHjsd6bjBD61RWVH+UovD6encCyNz24GvstIieX9uWIrfrpc433idmfjNcspdlzv-btIxWGVunQeRAkrm9HuTNHp0lAe+cBlU3aczHnJb22woAGjuK2egwQzRB2Xu1CGUsoYxhhhmGgcsHIny6HhZGmcr4uGiLEdGD89YRgNnXW6rE-BymHpRU2V5TzUSAfRSK+VHYy1OuVEeMkvqAWAvVIg6BMFgDSAvEc7U1Bh26iFcEVIN6YQXDCSIY18IZyuCOPOo0mEAJxCXeoZcYwhRoPKP+dJu6MVrsxSyzi2IUh4YItK-DO5wPxEVEm14pFc2QfItwrZEDBBIEHNRVpQ6ELXhUf4gIz4Zj0cfQx8E5p0Ksf5J+diX4OIruE3hHijqeQEWTAJXD2Ks14pgNw6BghiLtgIqq7s-xRNAncOIxQoh4AoK2VREsOqaPtI6Z0ujyFYTyRlLJqsL50KdLfIpj9WHP0Nq-WOJ0bz7S-vFdiHhDm21fq05eNMXbUVCelPMPTEF9O+mINwTA4jT0FhMhCw4bSr26iQ6oOS05LM2ufNc6zKzrl1sXEphQynFlyvlY2SZqlhLqYAhpaEgl3QgU7J5CDR6vP-IBEAFBiANlQCQlIEBqmgsqggLgUI8DVAcBAegvB0h4CyE8LCABJPg0AWVxGltsJg9Aji4GKHAQwABRIgeBwzFDiCwCAGIYCbC5Q0MViB7AcD9jACAbQQA0GHE8SlRBqXsDpdUiqJRiicv4GgAQ5KsIAGFbB+y5UQv62g7h+0tHwKAcQYBtDUCkO4Ww1AwDFYGvVk41BMFrkgbIrAbxhDiPQBSBAEB3AyF6qaaAkB3CYEwCSf1eAFDiKYaAghyXpDgJIRN+hS3ltwHAGAABBJAzbW0AFkEBEC2Kq9VnbhWht9ZAeVxQnVcobRYIAA",
        "https://colorflow.ls.graphics/embed.html#N4IgbgpgTgzglgewHYgFwEYAMAaEBzKOAEzVCgQHcY0BWXAYwQBtrU6QAHBOJAF1YDaA0MTQgAFgDMOAK0noAzCFzkKaHCEZN1uLvF6IUqUAA8dIAJ7qAvg2YIopEI9SYAdAE4AbJgAcuPHVPH38QACMg7z9cAEM0dFsJGKQiJghWUHFk1IgAGQhJXiczV1wrV0SslLSAJTg8cSLjEBL3TAUAdnZyzErstIBVDmLzHr7qiAARSiNTUaD2rsTeCw4IMRgAWwQEXnEQa1sRElQJDvpNmIAWAC9lZ0pzLXjdBH1DEdQAJkwNMbsmA4nC53FFQoFXMFouFIiFYvFxjkMkkJvlCp8ALRtTrdGy4Ko5OoNJpzSGLXEVfH9CBDTFtX5XMpoLFuPxXK6ItLTCizFrzMk45ardanLY7PYHI4gUSneg8sAxGg0e6qJ7MNBfV7vZCfK6-JmUzT2FxkWHQiGguEwyFg+EYTnpJwEtJokl81As8kG3pUiZExqfbFdb0O2nNVqs9oUlnodAdDoO7m81re1mC3ArNYbba7faHbDHMRhJB4G5fL5XFWPUpG7SoBRauAGHXhtA+P542tA5ogty+Gi+cFBXwKdCM62gjpedhxe2+pFO6muulp4OWTvOiD+t0Rr3rw2bsOkjsH6lJwOp8lCrOinMS-OF04ARxgNzgXyYXirahrz1Q470JsPlbVBfH1fcfS7E1nGHAch0hEcx1wCIbSnGcEXnNJkU3ZcQM9HEQ0wrd6gDECT0gw9hjIwiURyc9qIg1caGvEUQDFXNJQAXWwYRpROEBNg4ABrPB6BkITvxeWtzEA5tk2ZdA+y8K4PANdBfC8NwOgUEdEi0btTQQmgVICYcvgUdgUMnL50LnWisMXVECh3fkKOpbdAyYmjKJXX4aHQA1PQHDxExmTy-ICxjMGCljs3FPMpRlfAOC+XwoCfdYVGrSK-0i2TgNJdAvAUSMvlU-cbN8NxRw8BIAQMmDIS8DornYC0tK+IrkMiGgvHK2c6vsx1mhw5yV3LTAvECtoukGzcPLItwK28S9Yw5Iij3dT1Y01fdPS8TrQp5cKdsvA7BszVj2PvRL+JiXgAFdxGnDxJIwAENUbOTPgUbw3C8NaDU6jotIHLw9ONYEzLXdqOkHXarM8NC7Tm6lsKXMa8PcWNfHHHpWUUVG-RIlzIRxvHmTaQnQyo0lPUwXbyn2hMiPo49SrOlmQEuuKOIfPixA4MIKA8CAHskN6cvVesvoK90AcUvVlLUjS+1+wb9Og3tfHQFb8CCOGrgbCckenFGHXRpz0SxtxYw6SL8d+YqHQW9m7YdynI2djbaa2+l0EZz3MCndahrZ91-cDskQ9i294slAsBdOXgTHQMB6AgOBJY+-9ZZbUkdappUgauKrJt6iHAS14ddam-XIUN43EY8ZGQAGi3HJyXC6aDCk3OJ4lwrNvb6VSmmLxHpijvkmtHfTbnhV5m7uN4pKYhkBAwBMCgZDe3a-w0fL862rB-u0jogY8Dw1crhre1L4rTIbzAPFCZuX9CduiMtrvMePbz3Ik3CgRCC48GJM17tPCec8lgZkXnHPmt0xBeE2FcTY6AYDoD3jnPKbwgLHxKD8E8Chfi32rk1Dok0n7uAfk3SIH9zbf07i6P+fsvKgKIq7CO7D-hDU2imSeV5WZhXAQseePNZQOCQNABOj5whMCIHAJ8RBMDYOkt8POM89QlQUAdY25QbLuGajpMhUNIRXC+DDcwzd4aMKGj-Fh1se6218C1S8NBfouyAYtdSbjBEeJCj7aBQd56bnDgImBzE4E3jYneBKickpPhoGEC4ii1F-mNkfGePhFI0GilHCsNBPBFS5prMxRjKF13arQ7qNoGFtwwvY5heRWElHwmuXh81vHsz3J06k-D+TtKiWHER-8oriPgbE+O-Mkq8EwJsCwcAmBZyyj+fe0sAJ4O+iBMCxDSH1XIZFapo5xyI3aEhBpdlNwOJaU4thvSNyAMHotYOHRyoQMjBZMBYyPlCJGcdURApYELxiddBKK85GbBoB0GQXw4APTesbA+mjgn-jyaYns9DdrVKNpFRGHjtJ2Ouc07uEcAED1Ij0kBfSJgDNniE4FYTRlkvGcCiRUzEEJP4ogKAeBoASVWWgJF0tcHahngHEq6APEU3-KXNwpdtIYsMqCBm1D5W4tqe4Alxsv5NJGhjO5bTe7ksJN07hDzTy0t9ruTA7Jpq21aoE-5M96Z2sYmOGgTr2VgtkUnEA7IwhhBgDAL8gqZbqN2lkn6HgrhI37AaHSRSPAWQUEqxqoJcbG3aiQ1+mr1X2yJWjElrSGV9y8c8qlHTHlWt8lcZWk8xy4ygS8utMrsal1Dt6uJvqkoeCgA9GI9AODUDDcKusmStlyxKJQkGL9FAGgsUUuGRU029g8Kq+uNCNUm21YWiYNzSVGp4dW01FbzXUpPYMa1CxbXRncOZXwzbnEMj7ktEx0SrrdpmfxN5o4LAPWGKOnOmyxWfF2Qu9FBzymeA3Ti0cebd2XKJgufVVtSZDJNbUM1ETL00mvfSj0kDhEAp+WItlkyfWHAhX6sAXxJCSE6CQMN45kWcEnQQ-k7ZV1YrVeyeDO7Og6sacS1Dv9DWuXLZS89VbLU5DpSeIZT6WW8K7dMpBpwKBQo6AgGFb0WMipRSBIhBouNQcxe9Td-0Tl5uaq1PdKHMgGvQ8ajhQ0uG7gvbJq9qLFPEZnuRVk3guaqc5XIh6T4t4yCYNoZjOdI3sa0eBcopmoJmKOUEYqFzEa2dsshhyonHHOePV54iZ6PMyf7nJ-DCmiPOvCr8D2ZJX7BYo1+9TLQYD23oGADoemc4TtAyBdsJn9mpfM+lpq1mTY5fs-lxzaHfKecq1hsrZGy1BMBb5urLzfihEdh4GyscOU3S5WIK4MheBeAQAoTYfX1EgfwTPcD+4UtlPMyq7FQQ+N4qCIh3VIn5tiaKxa5bpWpM4ZK-J+1fymUkeU52ELy9uIgAoMQCUoFwLiEzs8lLvAEBcEBHgcozgID0F4MkPAaR7iawAJJ8GgAT+6wEQBMHoPsXAkg4AmAAKJED5awSQMQWAQFiDANYZOahM4QE4DgUB0gQCaP6+s9xUdEHR+OLH3jU24AKJIUn-A0Cr34qJOAmAmxYJ10gGIYQ0gnF4P2kXILWKc6YJsAA4lAGIPB7g8F4BAJA+h8ZXEivAG4IpcntaEkJIX4hBL3H99b23aB7cPUd+ytn5BLgGHoAAQTCNAT331cAIHozABXtA+zWGR5rAAwg4OXZO5YQBMHoB6cu1R8E9zAJoGhxCp-MDAe6bepdGA0Ms4k0jg2djCIOkS5AHopDr1XNASAHrRYzM33guQYgWGgIIZHyQ4BZ+Aqv9f0oYA56QEfkfABZBARARSC+F7gX30BB0GEgNz+j+v9-WCAA",
        "https://colorflow.ls.graphics/embed.html#N4IgbgpgTgzglgewHYgFwEYAMAaEBzKOAEzVCgQHcY0A2XAYwQBtrUAWXABwTiQBdWAbUGhiaEAFcArDSbokAWxC5yFNDhCMm6rgnh9EKVKAAeOkAE91AXwbMEUUiEepMAOkwAmAOxTcedQ82AGZ0XAAjQPQaTAAOXABDNHRbEAALBKQiJghWUAysnIAZCAAzPiczV1wrV1SC7IgAJTg8NIrjECr3dF6wyxtcBpyAVU5K81rMeszGgBFKI1NJwLjg4NS+C04IcRgFBAQ+NJBrW1ESVBBwi29MEzYATmVnSnMtZN19QwnUTxoaG4ATRvDVBpp7C4yKsfH58KsQv1Iq43NE4olkjNCrknMMICVyr8ALQ9PpgupDWY5FptDrLFF9fpTLGNMa-DTMynYhYUJZdFYotYbXBbHZ7A5HE5nbAXcRokwAKwgJxUb2qEO0fy+cAMyF+UnWbnW63J0zsTAcThc7i8vn8CNCESiMXiICSGBZOTy6Sp+LKdP5qBJqLJAwpPuxNPa7JDvVNnogbM63XjXPmi3Zpo8sXWm22uyu+0Ox1O5xAYiufFKbFKjyICBeqnezDQwW1ur5VVimA54K0ls61o8sPtgsRToZLoxHrTXtxvoJAaqwcZqYjjSjS4FZvXo3Gye3CZ5ne32dzIvz4uLUusAF1sCJy5cQJwEugAF4K8ISRtq-ofdVuG+PUD3VWp0CkHd+yhZwYTteEx0da5nXRN1MVnHFOjxRdMzDHc8U3GNVzwhMk3pXsgxtHNhV3CBj1wqYzxo0UCxAItJVLGUn3EKQmCgCB32CNhfzUDBzU+F89B1H5QM8dBYjcbxglBMNYkBLwpDYVJoKtOC4QCRCkRQ113RSDDvWw-1iRtNgvHJYMexCBNCNAm1NLoPCPEwYIaFI-dyK8x5XVqBy2Hko8M1cryDSzTB0G8WI8zFQsJRLaVZSuIhvDSBV304TwRIkgDPHbGT6UgqQ3DYGQmTQbxAR89AtPNAdoUFEcEJspDkR6Kc0JnWiLIXKzQIc9z7JtbzfIwlyAswKQZAmjxQj8mMeykEqw1CzSIt5ayPHQR4208uK2E8JLWPYtKywrF9-gARwoe6SFVUT-xbVBjqA6SQPpbtPFRbwlPJKRvCNIHtMhXT2vggyuqMydUNMhMhuxHDRtJOMSJm1po1ctc8TIwMKIc6jdpPMDVjJi9krY1Kb3vR9bpgQ7YgSPB6EKrUNXMb6O2JTxglRMKVNqTxPEqx42ABSGLRgodvKa0c3KeCcem8CXpzMwb5zRkb6VJzwOE8pqpG1gjca3QVYiNpbTfN30iZTLaqPPWj6Pxk7qZAFirw49LuKuOAdjSExgjMV60E2gD+j5srA3ksGsGCOExcwR43CNt2dMHPTlaCbrjK1lHdcadGDZsoKlp7FacdpNbjs5WindWTAaFTtAV3Wbxyf2nt26zdBu4uv3rq426FEePAEk8GAkkj7nitK37AxidBFNs43wPitwju82XWtgmH9IdBHeqR9Cdaw4bCQx5aCd9WbiY8IHYog5rm-85-5pzO3097u+P9G5RH-jTS69NOIZRABAR4jwpD0DYJzBe0cPpfSkvzUCsR0AA0eO3YBn0ewH3lnnTqBcz6oj6sjcypdij60DCuUMTcLb109kwx2X9uheViFvTu7gU5CQARXLhPCUT8I-r7FK15SyMygdABA9ApZKAXsdACGg44r2XGDNSv8wxCQzsaD+Oc2ruHFrDQIgtHibR6lVfhxdqHXz1rfciD9IyWyIow8EhMOECgcgCHuGEPbOJOn4kekj-Y3WfBQKQUALD0HuqULmKiPqx3QfHKonh5qKXmiI0IGcJbBEeEQ6GPR06ujhqiOSHlrE+QvgNPEqMy50OXCU6q1cMnTVok-ThWBWknXaatQB-wPIhRsvvAJkU5rtNimvUJdMpEB1umwbw9BOBQDiok8S3N1EU2lgDGgalap-BiG4LB9Uim5wZNw465SrGBEglXfqDtsQNNoU4+hPQJaHIcm3Qpdc8YBUOnZF2L84oDKEZgEIjxq5YI6XiQJ39IWxRhbMq6N5x7PgkAgNICAEgAGsEnKM2Wg4CFMsHrzUmwYKrYCmZylr8jUh8hyeFiN4KFpDggaTVm4TSGs7FX3yDfK2DCsZsNcSwoJorWTeMppRDwITxl7VYaseVPtLxhOujIwOIBqomAUCYCwP4F7G1UcvCmRJoiKQKZtWo1UFKPCUv4hlxCUQ0EOh5cpII25crpXy+pNC-RvOaV5BKdtbKJT+VbSaIaTZhrBcTaFbs4UTPjV7N2Ei5nhPRTxUonA+BQHoDQLmxrkmmt+ILPhBo2U2rikaIK5zjFAgeeUjWUtvUbTZVQ-ltFy7vI8I8Q61cYhSGcm4qK6cB3BPmnGzhELvAiJXE8D+SbFXgqWSInoi6UUQIWc+bwFg8DhGDg2I1mzNrbP1JkulVLPpSAzlgny9aj79AMgjfona-UOMaYG3hmcO6CmUrCx+o6AXKXwQ5QW06f2OWGT++SsRw3u2TTOn5WY2BocdemxgUAkDQEgVq+674Mn3TAGAItRLS2YIyXK1WYZqpQShhc59ElkRvsvh+gVjihWY0OfhID4qU2Sr3GtIZdsFqAe5EhqDImTZia3fMu8D4oEKgSBAPgljSMLzhCaySJKGK0EIS1Z17hKU0GuXciWcJrEmTY76F5AbI0uI3MB5+xFBOJmlSTV2NFl0UwojudNqK8PM1xegasPguZaZLTpn6FMhlAldX+mIPR1jnUM8UqqakzMog2gtLl1m6m2f9T2oNrnPF8f+S5jx4YvH7T6KLWDGsEM+fcfFQejW5OZqgVgBAFgKDoF2Jp09FHyqGmNPg11CkaDVWHWlxj+dYgPKs+OR5JdP2vK45nby1cvD0uYRV7pVXePYhbrKtu81oULUEQJ8EAXt0RLlEwNI9AiAKCUa8USkXNTEpi78bsFEkuPpcExsSyEQfvsK2t+ztXDsjv487NzJ3PNMSu-Dm7aqM0avvCACgxASyoD+0MCAo6AcigQNwC0eBajOAgPQPgmQ8A5BeNBAAkvwaA5OEgYJAEwegKoQClDgCYAAokQPAmFSgJBYBARIMAdi06aJzxAThVm5FU+INgn0Xg46IHj42aQicsJomUUoNOBBoCZs+ege6cWxAjtApACRwg5EuHmiQ0vVW015+QBQiv6AAEFwjQCgIrvUuAEClFKDANXn17tXEwCsmgk9j328d87tArv3eYbSN733Aeg8h5QGHiPUeOgZIU06gAwg4fitP44QBMEBCQ-Fmz8GDzADoGg0hu-MHPPgTeC-mCYJbHDMBWA7nCAkeguKCAIAkFkKvcs0BIAkEwJgIp698CKAkCw0AhBY8yHAH3GDl+r9wHAGAfukCH4LwAWQQEQAsEupdn7Z8H2vkAhcR9N3v6wQA"
    ];

    useEffect(() => {
        const fetchSubjects = async () => {
            const { data, error } = await supabase
                .from('subjects')
                .select('id, title, shortname')
                .eq('is_active', true);
            
            console.log("Error:", error);

            const subjectsWithGradients = data?.map((subject, index) => ({
                ...subject,
                iframeUrl: meshGradientUrls[index % meshGradientUrls.length]
            })) || [];
            
            setSubjects(subjectsWithGradients);
        };

        const fetchProfile = async () => {
            const {data: {session}} = await supabase.auth.getSession()

            if (session?.user){
                const {data} = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

                setProfile(data)
            } else {
                setProfile(null)
            }
        }

        fetchProfile()
        fetchSubjects()

        const {data: {subscription: authListener}} = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) fetchProfile()
            else setProfile(null)
        })

        const channel = supabase
        .channel('realtime-navbar')
        .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles'
        }, (payload) => {
            setProfile(prevProfile => {
                if (prevProfile && payload.new.id === prevProfile.id){
                    return payload.new
                }
                return prevProfile
            })
        })
        .subscribe()

        return () => {
            authListener.unsubscribe()
            supabase.removeChannel(channel)
        }

    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setProfile(null)
    }
    

    return(
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setNavOpen(!navOpen)}
                className="fixed top-6 left-6 z-50 md:hidden p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-700 transition">
                {navOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <nav className={`fixed bg-slate-900/50 top-0 left-0 h-screen w-24 z-50 glass-nav border-r border-slate-800 flex flex-col items-center gap-6 py-6 transition-transform duration-300 md:translate-x-0 ${
                navOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
                {/* Logo */}
                <div className="flex flex-col items-center gap-6">
                    <Link 
                        to="/" 
                        onClick={() => {
                            setSelectedSubject(null)
                            setNavOpen(false)
                        }}
                        className="w-16 h-16 rounded-3xl bg-gradient-to-br from-white to-white flex items-center justify-center text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 backdrop-blur-md border border-blue-400/30">
                        <img src="/icon_blue.png" alt="Logo" className="h-8" />
                    </Link>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

                </div>

                {/* Desktop Menu */}
                <div className="flex-1 flex flex-col items-center gap-4 overflow-y-auto scrollbar-hide">
                    {subjects.map((subject) => (
                        <button
                            key={subject.id}
                            onClick={() => handleSubjectClick(subject)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white backdrop-blur-md border transition-all duration-300 overflow-hidden relative group bg-gradient-to-br ${subject.gradient} ${
                                selectedSubject?.id === subject.id 
                                    ? 'border-white/30 shadow-lg shadow-current/50 opacity-100'
                                    : 'border-white/20 opacity-80 hover:opacity-100 hover:shadow-lg hover:border-white/30'
                            }`}>

                            <iframe
                                src={subject.iframeUrl}
                                className="absolute inset-0 w-full h-full rounded-full border-0 opacity-70"
                                style={{ pointerEvents: 'none' }}
                                allowFullScreen
                            />
                            
                            <span className="relative z-10">{subject.shortname}</span>
                        </button>
                    ))}
                </div>

                {/* Profile */}
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                    
                    {/* Clasament */}
                    <NavLink
                        to="/clasament"
                        onClick={() => {
                            setSelectedSubject(null)
                            setNavOpen(false)
                        }}
                        className={({ isActive }) => `w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300 ${
                            isActive
                                ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-white/30 shadow-lg shadow-yellow-500/50"
                                : "bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-white hover:shadow-lg"
                        }`}>
                        <Trophy className="h-6 w-6" />
                    </NavLink>

                    {profile ? (
                        <div className="relative">
                            <button onClick={() => setOpenProfile(!openProfile)}
                                    className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold backdrop-blur-md border border-slate-600/50 hover:border-white/30 transition-all duration-300 hover:shadow-lg">
                                        {profile?.username?.[0].toUpperCase()}
                            </button>
                            
                            {openProfile && (
                                <div className="absolute left-20 bottom-0 mb-2 w-48 p-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200">
                                    <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-700 mb-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{profile?.username}</p>
                                            <p className="text-xs text-slate-400">Lvl {profile?.level}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between px-2 py-2 rounded-lg mb-3">
                                        <span className="text-xs text-slate-400">Experiență</span>
                                        <span className="text-sm font-bold text-blue-400 font-mono">{profile?.xp} XP</span>
                                    </div>

                                    <Link 
                                        to="/profil" 
                                        className="flex items-center gap-2 w-full px-2 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition mb-2">
                                        <Settings className="h-4 w-4" />
                                        Setări
                                    </Link>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-2 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition">
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center justify-center text-white text-sm bg-main hover:bg-blue-700  px-4 py-2 rounded-lg font-medium transition">Login</Link>
                    )}
                </div>
            </nav>
            
            {/* Click outside to close menu */}
            {openProfile && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setOpenProfile(false)}
                ></div>
            )}

            {navOpen && (
                <div 
                    className="fixed inset-0 z-40 md:hidden" 
                    onClick={() => setNavOpen(false)}
                ></div>
            )}

            {/* Mobile Menu Bottom */}
            
            {/* <div className="w-full fixed bottom-0 bg-slate-900/50 glass-nav rounded-t-3xl border-t border-slate-600 z-10">
                <ul className=" flex justify-around md:hidden lg:hidden list-none gap-1 text-slate-400 text-xs font-medium cursor-pointer">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `py-4 ${isActive ? "text-white" : ""}`}>
                        <div className="flex flex-col items-center gap-1">
                            <Home className="h-5 w-5" />
                            <span>Acasă</span>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/probleme"
                        className={({ isActive }) => `py-4 ${isActive ? "text-white" : ""}`}>
                            <div className="flex flex-col items-center gap-1">
                                <Code className="h-5 w-5" />
                                <span>Probleme</span>
                            </div>
                    </NavLink>

                    <NavLink
                        to="/clasament"
                        className={({ isActive }) => `py-4 ${isActive ? "text-white" : ""}`}>
                            <div className="flex flex-col items-center gap-1">
                                <Trophy className="h-5 w-5" />
                                <span>Clasament</span>
                            </div>
                    </NavLink>
                </ul>
            </div> */}
        </>
    );
}

export default Navbar;