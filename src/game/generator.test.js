import { describe, it, expect, beforeEach } from 'vitest'
import { DIFICULTADES, getDificultad, llevaAlgo, pidePrestado } from './dificultades.js'
import { generarPregunta, generarRonda, generarDistractores } from './generator.js'
import { registrarResultado } from './storage.js'

describe('dificultades', () => {
  it('getDificultad cae en la primera si el id no existe', () => {
    expect(getDificultad('experto').id).toBe('experto')
    expect(getDificultad('nada').id).toBe('facil')
  })
})

describe('generarPregunta', () => {
  for (const dif of DIFICULTADES) {
    it(`${dif.nombre} genera preguntas válidas`, () => {
      for (let i = 0; i < 500; i++) {
        const p = generarPregunta(dif)
        expect(p.respuesta).toBe(p.op === '+' ? p.a + p.b : p.a - p.b)
        expect(p.respuesta).toBeGreaterThanOrEqual(0)
        expect(p.opciones).toHaveLength(3)
        expect(new Set(p.opciones).size).toBe(3)
        expect(p.opciones).toContain(p.respuesta)
        p.opciones.forEach((o) => expect(o).toBeGreaterThanOrEqual(0))
      }
    })
  }

  it('fácil usa números de una cifra', () => {
    for (let i = 0; i < 300; i++) {
      const p = generarPregunta(getDificultad('facil'))
      expect(p.b).toBeLessThanOrEqual(9)
      expect(p.a).toBeLessThanOrEqual(18)
    }
  })

  it('las dos cifras de difícil llevan o piden prestado', () => {
    for (let i = 0; i < 300; i++) {
      const p = generarPregunta(getDificultad('dificil'))
      if (p.a > 99) continue
      expect(p.op === '+' ? llevaAlgo(p.a, p.b) : pidePrestado(p.a, p.b)).toBe(true)
    }
  })
})

describe('generarDistractores', () => {
  it('desde 20 comparten la última cifra con la respuesta', () => {
    for (const r of [20, 77, 135, 4130, 9999]) {
      generarDistractores(r).forEach((d) => expect(d % 10).toBe(r % 10))
    }
  })

  it('funciona con respuestas pequeñas', () => {
    for (const r of [0, 1, 2]) {
      const d = generarDistractores(r)
      expect(d).toHaveLength(2)
      expect(d).not.toContain(r)
      d.forEach((n) => expect(n).toBeGreaterThanOrEqual(0))
    }
  })
})

describe('generarRonda', () => {
  it('devuelve 10 preguntas sin repetir', () => {
    const ronda = generarRonda(getDificultad('dificil'))
    expect(ronda).toHaveLength(10)
    expect(new Set(ronda.map((p) => `${p.a}${p.op}${p.b}`)).size).toBe(10)
  })
})

describe('registrarResultado', () => {
  beforeEach(() => {
    globalThis.localStorage = { getItem: () => null, setItem: () => {} }
  })

  it('solo guarda con suficientes aciertos y si mejora', () => {
    let r = registrarResultado({}, 'escribir', 'facil', 6, 1000)
    expect(r.records).toEqual({})
    r = registrarResultado({}, 'escribir', 'facil', 8, 1000)
    expect(r.records).toEqual({ 'escribir:facil': 1000 })
    expect(r.nuevoRecord).toBe(false)
    const peor = registrarResultado(r.records, 'escribir', 'facil', 10, 1200)
    expect(peor.records['escribir:facil']).toBe(1000)
    const mejor = registrarResultado(r.records, 'escribir', 'facil', 10, 800)
    expect(mejor.records['escribir:facil']).toBe(800)
    expect(mejor.nuevoRecord).toBe(true)
  })
})
