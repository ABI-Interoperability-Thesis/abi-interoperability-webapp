export const GenerateRequestCode = async (lang, data) => {
    const messages = data['messages']
    const model_name = data['model_name']
    const source_type = data['source_type']

    if (lang === 'js'){
        return await GenerateJavaScriptRequest(messages, model_name, source_type)
    }else if (lang === 'python'){
        return await GeneratePythonRequest(messages, model_name, source_type)
    }else if (lang === 'java'){
        return await GenerateJavaRequest(messages, model_name, source_type)
    }else if (lang === 'csharp'){
        return await GenerateCSharpRequest(messages, model_name, source_type)
    }else if (lang === 'c'){
        return await GenerateCRequest(messages, model_name, source_type)
    }else if (lang === 'cURL'){
        return await GenerateCurlCommand(messages, model_name, source_type)
    }else if (lang === 'go'){
        return await GenerateGoRequest(messages, model_name, source_type)
    }else if (lang === 'php'){
        return await GeneratePhpRequest(messages, model_name, source_type)
    }
}

// Generate Javascript Request
const GenerateJavaScriptRequest = async (messages, model_name, source_type) => {
    return `
try{
    const url = [your-abi-interoperability-ip:port]/api/run-interoperability?test=true
    const method = 'POST'
    const data = {
        messages:${JSON.stringify(messages)},
        model_name:${JSON.stringify(model_name)},
        source_type:${JSON.stringify(source_type)},
    }
    const axios_config = {method, url, data}
    const axios_response = await axios(config)

    // This is the response from the server
    console.log(axios_response)
}catch(err){
    console.log(err.message)
}`
}

// Generate Python Request
const GeneratePythonRequest = (messages, model_name, source_type) => {
    return `
import requests
import json

def generate_python_request():
    try:
        url = 'http://your-abi-interoperability-ip:port/api/run-interoperability?test=true'
        method = 'POST'
        data = {
            'messages': ${JSON.stringify(messages)},
            'model_name': ${JSON.stringify(model_name)},
            'source_type': ${JSON.stringify(source_type)},
        }
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, json=data, headers=headers)

        # This is the response from the server
        print(response.json())
    except Exception as err:
        print(str(err))
generate_python_request()
`
}

// Generate Java Request
const GenerateJavaRequest = (messages, model_name, source_type) => {
    return `
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class HttpJavaRequest {
    public static void main(String[] args) throws IOException {
        OkHttpClient client = new OkHttpClient();
        String url = "http://your-abi-interoperability-ip:port/api/run-interoperability?test=true";
        String method = "POST";
        
        Map<String, Object> data = new HashMap<>();
        data.put("messages", ${JSON.stringify(messages)});
        data.put("model_name", ${JSON.stringify(model_name)});
        data.put("source_type", ${JSON.stringify(source_type)});
        
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, new Gson().toJson(data));
        
        Request request = new Request.Builder()
            .url(url)
            .method(method, body)
            .addHeader("Content-Type", "application/json")
            .build();
        
        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            // This is the response from the server
            System.out.println(responseBody);
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
    }
}
`;
}

// Generate C# Request
const GenerateCSharpRequest = (messages, model_name, source_type) => {
    return `
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

class Program
{
    static async Task Main(string[] args)
    {
        try
        {
            var url = "http://your-abi-interoperability-ip:port/api/run-interoperability?test=true";
            var method = HttpMethod.Post;
            
            var data = new Dictionary<string, string>
            {
                {"messages", ${JSON.stringify(messages)}},
                {"model_name", ${JSON.stringify(model_name)}},
                {"source_type", ${JSON.stringify(source_type)}}
            };
            
            using (var httpClient = new HttpClient())
            {
                var content = new FormUrlEncodedContent(data);
                var request = new HttpRequestMessage(method, url)
                {
                    Content = content
                };
                
                var response = await httpClient.SendAsync(request);
                var responseBody = await response.Content.ReadAsStringAsync();
                
                // This is the response from the server
                Console.WriteLine(responseBody);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}
`;
}

// Generate C Request
const GenerateCRequest = (messages, model_name, source_type) => {
    return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>

int main(void) {
    CURL *curl;
    CURLcode res;
    
    const char *url = "http://your-abi-interoperability-ip:port/api/run-interoperability?test=true";
    
    // Create a JSON payload
    char *data = malloc(1024);  // Adjust the buffer size as needed
    snprintf(data, 1024, "{\"messages\": %s, \"model_name\": %s, \"source_type\": %s}",
             ${JSON.stringify(messages)}, ${JSON.stringify(model_name)}, ${JSON.stringify(source_type)});
    
    curl = curl_easy_init();
    if (curl) {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        
        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
        
        res = curl_easy_perform(curl);
        
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }
        
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
        free(data);
    }
    
    return 0;
}
`;
}

// Generate cURL Request
const GenerateCurlCommand = (messages, model_name, source_type) => {
    const url = 'http://your-abi-interoperability-ip:port/api/run-interoperability?test=true';
    
    const data = {
        messages: JSON.stringify(messages),
        model_name: JSON.stringify(model_name),
        source_type: JSON.stringify(source_type)
    };

    // Build the cURL command
    const curlCommand = `curl -X POST -H "Content-Type: application/json" -d '${JSON.stringify(data)}' ${url}`;
    
    return curlCommand;
};


// Generate Go Request
const GenerateGoRequest = (messages, model_name, source_type) => {
    return `
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    url := "http://your-abi-interoperability-ip:port/api/run-interoperability?test=true"
    
    // Define the data payload
    data := map[string]interface{}{
        "messages":   ${JSON.stringify(messages)},
        "model_name": ${JSON.stringify(model_name)},
        "source_type": ${JSON.stringify(source_type)},
    }

    // Convert data to JSON
    jsonData, err := json.Marshal(data)
    if err != nil {
        fmt.Println("Error marshaling JSON:", err)
        return
    }

    // Create a POST request
    req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
    if err != nil {
        fmt.Println("Error creating request:", err)
        return
    }
    req.Header.Set("Content-Type", "application/json")

    // Perform the request
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        fmt.Println("Error making request:", err)
        return
    }
    defer resp.Body.Close()

    // Read and print the response
    body := make([]byte, 1024)
    _, err = resp.Body.Read(body)
    if err != nil {
        fmt.Println("Error reading response:", err)
        return
    }
    fmt.Println(string(body))
}
`
}

// Generate PHP Request
const GeneratePhpRequest = (messages, model_name, source_type) => {
    return `
<?php

$url = 'http://your-abi-interoperability-ip:port/api/run-interoperability?test=true';

// Data to be sent in the POST request
$data = array(
    'messages' => json_encode(${JSON.stringify(messages)}),
    'model_name' => json_encode(${JSON.stringify(model_name)}),
    'source_type' => json_encode(${JSON.stringify(source_type)})
);

$options = array(
    'http' => array(
        'header' => "Content-Type: application/json\r\n",
        'method' => 'POST',
        'content' => json_encode($data)
    )
);

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === false) {
    echo "Error reading the response from the server";
} else {
    echo $response;
}

?>
`;
}


