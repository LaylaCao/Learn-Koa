package main
import "fmt"
func main(){
	n := lengthOfLongestSubstring("abcabcbb")
	fmt.Println(n)
}
func lengthOfLongestSubstring(s string) int {
    m := make(map[byte]int)
    start,length := 0,0
    for i,v := range []byte(s){
        // if m[v]<start {
        //     start = i+1
        // }else {
        //     if lenght
        // }
        m[v]= i
        if m[v]<start{
            if m[v]-start+1 >length{
                length = m[v]-start+1
            }
        }else{
            start = m[v]
        }
    }
    return length
}