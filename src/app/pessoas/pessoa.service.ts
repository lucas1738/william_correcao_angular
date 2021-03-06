import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Pessoa } from '../utils/model';
import { environment } from './../../environments/environment';



export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 4;
}


@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoasUrl: string;

  constructor(private httpClient: HttpClient) {

    this.pessoasUrl = `${environment.apiUrl}/pessoas`;

   }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');


    let params = new HttpParams();
    if (filtro.nome) {
      params = params.set('nome', filtro.nome);
  }

    params = params.set('page', filtro.pagina.toString());
    params = params.set('size', filtro.itensPorPagina.toString());

    return this.httpClient.get(`${this.pessoasUrl}`, { headers, params })
    .toPromise()
    // tslint:disable-next-line: no-string-literal
    .then(response => {
      const pessoas = response['content']
      const resultado = {
        pessoas,
        total: response['totalElements']
      };
      return resultado;
    });

  }

  listarTodas(): Promise<any>{
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    return this.httpClient.get(this.pessoasUrl, {headers})
      .toPromise()
      .then(response => response['content']);
  }

  excluir(codigo: number): Promise<void> {
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.httpClient.delete(`${this.pessoasUrl}/${codigo}`, {headers})
    .toPromise()
    .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
      .append('Content-Type', 'application/json');
    return this.httpClient.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers })
    .toPromise()
    .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    const headers = new HttpHeaders()
    .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
    .append('Content-Type', 'application/json');

    return this.httpClient.post(`${this.pessoasUrl}`, pessoa, { headers })
      .toPromise()
      .then(response => response['content']);
  }

  buscarPorCodigo(codigo:number): Promise<Pessoa>{
    const headers = new HttpHeaders().append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

    return this.httpClient.get(`${this.pessoasUrl}/${codigo}`, {headers})
    .toPromise()
    .then(response => {
      const pessoa = response as Pessoa;
    return pessoa;
    });

  }

  atualizar(pessoa: Pessoa): Promise<Pessoa>{
    const headers = new HttpHeaders()
    .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
    .append('Content-Type', 'application/json');

    return this.httpClient.put(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa, { headers })
      .toPromise()
      .then(response => {
        const pessoaAlterada = response as Pessoa;

        return pessoaAlterada;
      });
  }
}
